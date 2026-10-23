"""Compare interactions.create vs models.generate_content latency."""

from __future__ import annotations

import time

from google import genai

from services.investigation import GEMINI_API_KEY, GEMINI_MODEL


def main() -> None:
    if not GEMINI_API_KEY:
        print("PROBE_SKIP GEMINI_API_KEY missing")
        return

    client = genai.Client(
        api_key=GEMINI_API_KEY,
        http_options={"timeout": 45000},
    )
    prompt = 'Reply with exactly: {"ok": true}'

    t0 = time.perf_counter()
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        elapsed = time.perf_counter() - t0
        text = response.text or ""
        print(
            "GENERATE_OK",
            round(elapsed, 2),
            "chars",
            len(text),
            "preview",
            repr(text[:120]),
        )
    except Exception as exc:  # noqa: BLE001
        elapsed = time.perf_counter() - t0
        print(
            "GENERATE_FAIL",
            round(elapsed, 2),
            type(exc).__name__,
            str(exc)[:400],
        )

    t1 = time.perf_counter()
    try:
        response = client.interactions.create(
            model=GEMINI_MODEL,
            input=prompt,
            timeout=45.0,
        )
        elapsed = time.perf_counter() - t1
        text = response.output_text or ""
        print(
            "INTERACT_OK",
            round(elapsed, 2),
            "chars",
            len(text),
            "preview",
            repr(text[:120]),
        )
    except Exception as exc:  # noqa: BLE001
        elapsed = time.perf_counter() - t1
        print(
            "INTERACT_FAIL",
            round(elapsed, 2),
            type(exc).__name__,
            str(exc)[:400],
        )


if __name__ == "__main__":
    main()
