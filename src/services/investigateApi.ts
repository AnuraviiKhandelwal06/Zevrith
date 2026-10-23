import { isRecord, parseInvestigationResult } from "../lib/validation";
import type { InvestigationResult } from "../types/investigation";

const INVESTIGATE_URL = "http://127.0.0.1:8000/api/investigate";

export async function investigateClaim(
  claim: string,
): Promise<InvestigationResult> {
  let response: Response;

  try {
    response = await fetch(INVESTIGATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        claim,
      }),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Couldn't reach Zevrith's backend. Check that it is running at http://127.0.0.1:8000.",
      );
    }

    throw error;
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Zevrith returned an unreadable response. Please try again.",
    );
  }

  if (!response.ok) {
    const detail =
      isRecord(data) && typeof data.detail === "string"
        ? data.detail
        : "The investigation request failed.";

    throw new Error(detail);
  }

  return parseInvestigationResult(data);
}
