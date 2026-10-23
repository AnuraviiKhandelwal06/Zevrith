"""One-off latency probe for Gemini interactions. Do not log secrets."""

from __future__ import annotations

import time

from google import genai

from services.investigation import GEMINI_API_KEY, GEMINI_MODEL, _build_prompt


def main() -> None:
    if not GEMINI_API_KEY:
        print("PROBE_SKIP GEMINI_API_KEY missing")
        return

    client = genai.Client(
        api_key=GEMINI_API_KEY,
        http_options={"timeout": 90000},
    )

    t0 = time.perf_counter()
    try:
        response = client.interactions.create(
            model=GEMINI_MODEL,
            input='Reply with exactly: {"ok": true}',
            timeout=60.0,
        )
        elapsed = time.perf_counter() - t0
        text = response.output_text or ""
        print(
            "PROBE1_OK",
            round(elapsed, 2),
            "chars",
            len(text),
            "preview",
            repr(text[:120]),
        )
    except Exception as exc:  # noqa: BLE001 - probe reports failure type
        elapsed = time.perf_counter() - t0
        print(
            "PROBE1_FAIL",
            round(elapsed, 2),
            type(exc).__name__,
            str(exc)[:300],
        )

    sources = [
        {
            "title": (
                f"Source {index} about coffee and concentration research overview"
            ),
            "url": f"https://example.com/article/{index}",
            "published_date": "2024-01-15",
            "snippet": (
                "Coffee contains caffeine which may affect alertness. " * 40
            )[:1800],
        }
        for index in range(5)
    ]
    prompt = _build_prompt(
        "Does drinking coffee improve concentration?",
        sources,
    )
    print("PROMPT_CHARS", len(prompt))

    t1 = time.perf_counter()
    try:
        response = client.interactions.create(
            model=GEMINI_MODEL,
            input=prompt,
            timeout=90.0,
        )
        elapsed = time.perf_counter() - t1
        text = response.output_text or ""
        print(
            "PROBE2_OK",
            round(elapsed, 2),
            "chars",
            len(text),
            "preview",
            repr(text[:160]),
        )
    except Exception as exc:  # noqa: BLE001 - probe reports failure type
        elapsed = time.perf_counter() - t1
        print(
            "PROBE2_FAIL",
            round(elapsed, 2),
            type(exc).__name__,
            str(exc)[:400],
        )


if __name__ == "__main__":
    main()
