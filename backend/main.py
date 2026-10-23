import httpx
import uuid
from datetime import datetime
from typing import Any

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

from database import Base, SessionLocal, engine
from models import InvestigationRecord
from services.exa_search import search_web
from services.investigation import investigate_claim


# Create database tables if they do not exist.
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Zevrith API",
    description="Evidence intelligence and claim investigation API",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class InvestigationRequest(BaseModel):
    claim: str = Field(..., min_length=8, max_length=500)


class HistoryImportEntry(BaseModel):
    id: str
    savedAt: datetime
    result: dict[str, Any]


class HistoryImportRequest(BaseModel):
    entries: list[HistoryImportEntry]


@app.get("/")
def root():
    return {
        "app": "Zevrith",
        "message": "Evidence intelligence API is running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "app": "Zevrith",
    }


@app.get("/api/search")
async def search(
    q: str = Query(..., min_length=3, max_length=500),
):
    try:
        results = await search_web(q, num_results=5)

        return {
            "query": q,
            "result_count": len(results),
            "results": results,
        }

    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=(
                f"Search provider returned HTTP "
                f"{exc.response.status_code}."
            ),
        ) from exc

    except (httpx.RequestError, RuntimeError) as exc:
        raise HTTPException(
            status_code=502,
            detail="The search provider could not complete the request.",
        ) from exc


@app.post("/api/investigate")
async def investigate(request: InvestigationRequest):
    # Perform the investigation using the existing service.
    try:
        result = await investigate_claim(request.claim)

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc

    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=(
                f"Search provider returned HTTP "
                f"{exc.response.status_code}."
            ),
        ) from exc

    except (httpx.RequestError, RuntimeError) as exc:
        raise HTTPException(
            status_code=502,
            detail=(
                "The investigation could not retrieve evidence "
                "from the search provider."
            ),
        ) from exc

    # Save the report in PostgreSQL.
    try:
        with SessionLocal() as db:
            record = InvestigationRecord(
                claim=result["claim"],
                result=result,
            )

            db.add(record)
            db.commit()
            db.refresh(record)

            return {
                "id": record.id,
                "savedAt": record.created_at.isoformat(),
                **result,
            }

    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "The investigation completed, but its report "
                "could not be saved to PostgreSQL."
            ),
        ) from exc


@app.get("/api/history")
def get_history(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
):
    try:
        with SessionLocal() as db:
            records = db.scalars(
                select(InvestigationRecord)
                .order_by(
                    InvestigationRecord.created_at.desc()
                )
                .offset(offset)
                .limit(limit)
            ).all()

            return {
                "entries": [
                    {
                        "id": record.id,
                        "savedAt": record.created_at.isoformat(),
                        "result": record.result,
                    }
                    for record in records
                ],
                "limit": limit,
                "offset": offset,
            }

    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not retrieve investigation history.",
        ) from exc


@app.post("/api/history/import")
def import_history(request: HistoryImportRequest):
    imported = 0
    skipped = 0

    try:
        with SessionLocal() as db:
            for entry in request.entries:
                # Browser history IDs must be valid UUIDs.
                try:
                    entry_id = str(uuid.UUID(entry.id))
                except (ValueError, AttributeError, TypeError):
                    skipped += 1
                    continue

                # Do not import entries that already exist.
                if db.get(InvestigationRecord, entry_id) is not None:
                    skipped += 1
                    continue

                claim = entry.result.get("claim")

                if not isinstance(claim, str) or not claim.strip():
                    skipped += 1
                    continue

                record = InvestigationRecord(
                    id=entry_id,
                    claim=claim[:500],
                    result=entry.result,
                    created_at=entry.savedAt,
                )

                db.add(record)
                imported += 1

            db.commit()

        return {
            "message": "History import completed.",
            "imported": imported,
            "skipped": skipped,
        }

    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not import browser history into PostgreSQL.",
        ) from exc


@app.get("/api/history/{entry_id}")
def get_history_entry(entry_id: str):
    try:
        with SessionLocal() as db:
            record = db.get(
                InvestigationRecord,
                entry_id,
            )

            if record is None:
                raise HTTPException(
                    status_code=404,
                    detail="History entry not found.",
                )

            return {
                "id": record.id,
                "savedAt": record.created_at.isoformat(),
                "result": record.result,
            }

    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not retrieve the saved investigation.",
        ) from exc


@app.delete("/api/history/{entry_id}")
def delete_history_entry(entry_id: str):
    try:
        with SessionLocal() as db:
            record = db.get(
                InvestigationRecord,
                entry_id,
            )

            if record is None:
                raise HTTPException(
                    status_code=404,
                    detail="History entry not found.",
                )

            db.delete(record)
            db.commit()

            return {
                "message": "History entry deleted.",
                "id": entry_id,
            }

    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not delete the history entry.",
        ) from exc


@app.delete("/api/history")
def clear_history():
    try:
        with SessionLocal() as db:
            db.query(InvestigationRecord).delete()
            db.commit()

            return {
                "message": "Investigation history cleared."
            }

    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not clear investigation history.",
        ) from exc