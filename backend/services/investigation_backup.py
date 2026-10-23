
import re

from services.exa_search import search_web


STOP_WORDS = {
    "the", "and", "for", "that", "with", "from", "this",
    "are", "was", "were", "does", "into", "than", "have",
    "has", "can", "could", "would", "should", "about",
    "which", "their", "they", "them", "these", "those",
    "been", "being", "also", "such", "both", "more",
    "most", "other", "using", "used", "study", "studies",
    "results", "result", "conclusion", "conclusions",
    "objective", "methods", "method", "abstract",
    "improve", "improves", "improved", "improvement",
    "effective", "effect", "effects", "evidence",
}

# Basic normalization to help match related wording.
SYNONYMS = {
    "coffee": "caffeine",
    "drinking": "consume",
    "consumption": "consume",
    "concentration": "attention",
    "enhances": "enhance",
    "enhanced": "enhance",
    "improving": "improve",
    "improved": "improve",
}


def _tokens(text: str) -> set[str]:
    """Extract normalized terms for a basic relevance comparison."""
    words = re.findall(r"[a-zA-Z]{3,}", text.lower())

    return {
        SYNONYMS.get(word, word)
        for word in words
        if word not in STOP_WORDS
    }


def _assess_source(claim: str, source: dict) -> dict:
    """Assess basic relevance without claiming to determine truth."""
    text = " ".join([
        str(source.get("title") or ""),
        str(source.get("snippet") or ""),
    ])

    claim_terms = _tokens(claim)
    source_terms = _tokens(text)
    overlap = claim_terms & source_terms

    if overlap:
        label = "inconclusive"
        explanation = (
            "The source shares relevant terms with the claim, "
            "but keyword matching cannot determine whether it "
            "supports or contradicts the claim."
        )
    else:
        label = "inconclusive"
        explanation = (
            "No normalized terms matched. The source may still be "
            "relevant because it can use different terminology."
        )

    return {
        **source,
        "evidence_label": label,
        "matched_terms": sorted(overlap),
        "assessment_note": explanation,
    }


async def investigate_claim(claim: str) -> dict:
    """Retrieve sources and return a preliminary investigation."""
    normalized_claim = " ".join(claim.split())

    if len(normalized_claim) < 8:
        raise ValueError(
            "Please enter a more specific claim (at least 8 characters)."
        )

    sources = await search_web(normalized_claim, num_results=5)

    assessed_sources = [
        _assess_source(normalized_claim, source)
        for source in sources
    ]

    return {
        "claim": normalized_claim,
        "status": "preliminary",
        "assessment_method": "normalized_keyword_overlap_baseline",
        "summary": (
            "Sources were retrieved and checked for basic keyword "
            "relevance. Support-versus-contradiction reasoning has "
            "not yet been implemented."
        ),
        "source_count": len(assessed_sources),
        "sources": assessed_sources,
        "limitations": [
            "Keyword overlap does not establish whether a claim is true.",
            "Different terminology can cause relevant sources to be missed.",
            "Source authority and independence have not yet been evaluated.",
            "The results are preliminary and are not a final verdict.",
        ],
    }
