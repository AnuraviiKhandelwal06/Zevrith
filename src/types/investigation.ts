export type EvidenceLabel =
  | "supports"
  | "contradicts"
  | "mixed"
  | "inconclusive";

export type InvestigationSource = {
  title: string | null;
  url: string | null;
  published_date: string | null;
  snippet: string | null;
  evidence_label: EvidenceLabel;
  reasoning: string;
};

export type InvestigationResult = {
  claim: string;
  status: string;
  assessment_method: string;
  overall_assessment: EvidenceLabel;
  summary: string;
  source_count: number;
  sources: InvestigationSource[];
  limitations: string[];
};

export const assessmentLabels: Record<EvidenceLabel, string> = {
  supports: "Supporting",
  contradicts: "Contradicting",
  mixed: "Mixed evidence",
  inconclusive: "Inconclusive",
};

export type HistoryEntry = {
  id: string;
  savedAt: string;
  result: InvestigationResult;
};
