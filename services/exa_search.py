import os

import httpx
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

EXA_API_KEY = os.getenv("EXA_API_KEY")
EXA_SEARCH_URL = "https://api.exa.ai/search"


async def search_web(query: str, num_results: int = 5) -> list[dict]:
    if not EXA_API_KEY:
        raise RuntimeError("EXA_API_KEY is not configured.")

    payload = {
        "query": query,
        "type": "fast",
        "numResults": max(1, min(num_results, 5)),
        "contents": {
            "highlights": {
                "numSentences": 3,
                "highlightsPerUrl": 2,
                "query": query,
            }
        },
    }

    headers = {"x-api-key": EXA_API_KEY}

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            EXA_SEARCH_URL,
            headers=headers,
            json=payload,
        )
        response.raise_for_status()
        data = response.json()

    results = []

    for item in data.get("results", []):
        highlights = item.get("highlights") or []
        results.append({
            "title": item.get("title"),
            "url": item.get("url"),
            "published_date": item.get("publishedDate"),
            "snippet": " ".join(highlights) if highlights else None,
        })

    return results
