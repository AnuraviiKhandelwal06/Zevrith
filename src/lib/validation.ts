import type {
  EvidenceLabel,
  InvestigationResult,
} from "../types/investigation";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function isEvidenceLabel(value: unknown): value is EvidenceLabel {
  return (
    value === "supports" ||
    value === "contradicts" ||
    value === "mixed" ||
    value === "inconclusive"
  );
}

export function parseInvestigationResult(
  value: unknown,
): InvestigationResult {
  if (!isRecord(value)) {
    throw new Error(
      "Zevrith returned an invalid response. Please try again.",
    );
  }

  const validSources =
    Array.isArray(value.sources) &&
    value.sources.every(
      (source) =>
        isRecord(source) &&
        (typeof source.title === "string" ||
          source.title === null) &&
        (typeof source.url === "string" ||
          source.url === null) &&
        (typeof source.published_date === "string" ||
          source.published_date === null) &&
        (typeof source.snippet === "string" ||
          source.snippet === null) &&
        isEvidenceLabel(source.evidence_label) &&
        typeof source.reasoning === "string",
    );

  if (
    typeof value.claim !== "string" ||
    typeof value.status !== "string" ||
    typeof value.assessment_method !== "string" ||
    !isEvidenceLabel(value.overall_assessment) ||
    typeof value.summary !== "string" ||
    typeof value.source_count !== "number" ||
    !Number.isInteger(value.source_count) ||
    value.source_count < 0 ||
    !validSources ||
    !Array.isArray(value.limitations) ||
    !value.limitations.every((item) => typeof item === "string")
  ) {
    throw new Error(
      "Zevrith returned an incomplete or unexpected response. Please try again.",
    );
  }

  return value as unknown as InvestigationResult;
}
