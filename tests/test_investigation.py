import pytest

from services.investigation import investigate_claim


@pytest.mark.anyio
async def test_claim_too_short_is_rejected():
    with pytest.raises(ValueError):
        await investigate_claim("coffee")


@pytest.mark.anyio
async def test_whitespace_only_claim_is_rejected():
    with pytest.raises(ValueError):
        await investigate_claim("        ")


@pytest.mark.anyio
async def test_gemini_timeout_returns_inconclusive_result(monkeypatch):
    import services.investigation as investigation

    sources = [
        {
            "title": "Example source",
            "url": "https://example.com/source",
            "published_date": None,
            "snippet": "A short source snippet for testing timeout handling.",
        }
    ]

    async def fake_search_web(claim, num_results=5):
        return sources

    def slow_analysis(claim, retrieved_sources):
        import time
        time.sleep(0.1)
        return {}

    monkeypatch.setattr(investigation, "search_web", fake_search_web)
    monkeypatch.setattr(investigation, "_analyze_with_gemini", slow_analysis)
    monkeypatch.setattr(investigation, "ANALYSIS_TIMEOUT_SECONDS", 0.01)

    result = await investigation.investigate_claim(
        "A sufficiently specific test claim"
    )

    assert result["status"] == "analysis_unavailable"
    assert result["overall_assessment"] == "inconclusive"
    assert result["source_count"] == 1
    assert result["sources"][0]["evidence_label"] == "inconclusive"
    assert "exceeded the allowed waiting time" in result["limitations"][0]
