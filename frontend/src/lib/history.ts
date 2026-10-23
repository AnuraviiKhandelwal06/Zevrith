import { parseInvestigationResult } from "./validation";
import type {
  HistoryEntry,
  InvestigationResult,
} from "../types/investigation";

export const HISTORY_STORAGE_KEY = "zevrith:history:v1";
export const CURRENT_RESULT_KEY = "zevrith:current:v1";

const MAX_HISTORY_ENTRIES = 50;

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseHistoryEntry(value: unknown): HistoryEntry | null {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return null;
  }

  const record = value as Record<string, unknown>;

  if (
    typeof record.id !== "string" ||
    typeof record.savedAt !== "string"
  ) {
    return null;
  }

  try {
    return {
      id: record.id,
      savedAt: record.savedAt,
      result: parseInvestigationResult(record.result),
    };
  } catch {
    return null;
  }
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);

    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(parseHistoryEntry)
      .filter((entry): entry is HistoryEntry => entry !== null);
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): boolean {
  try {
    localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(entries.slice(0, MAX_HISTORY_ENTRIES)),
    );
    return true;
  } catch {
    return false;
  }
}

export function addHistoryEntry(
  result: InvestigationResult,
): HistoryEntry | null {
  const entry: HistoryEntry = {
    id: createId(),
    savedAt: new Date().toISOString(),
    result,
  };

  const existing = loadHistory();
  const next = [entry, ...existing].slice(0, MAX_HISTORY_ENTRIES);
  const saved = saveHistory(next);

  return saved ? entry : null;
}

export function deleteHistoryEntry(id: string): HistoryEntry[] {
  const next = loadHistory().filter((entry) => entry.id !== id);
  saveHistory(next);
  return next;
}

export function clearHistory(): boolean {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function getHistoryEntry(id: string): HistoryEntry | null {
  return loadHistory().find((entry) => entry.id === id) ?? null;
}

export function setCurrentResult(result: InvestigationResult): void {
  try {
    sessionStorage.setItem(CURRENT_RESULT_KEY, JSON.stringify(result));
  } catch {
    // Ignore storage failures; in-memory navigation still works.
  }
}

export function getCurrentResult(): InvestigationResult | null {
  try {
    const raw = sessionStorage.getItem(CURRENT_RESULT_KEY);

    if (!raw) return null;

    return parseInvestigationResult(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export function clearCurrentResult(): void {
  try {
    sessionStorage.removeItem(CURRENT_RESULT_KEY);
  } catch {
    // Ignore storage failures.
  }
}

/** Prefer the in-session current result; fall back to the latest history entry. */
export function restoreDisplayResult(): InvestigationResult | null {
  const current = getCurrentResult();

  if (current) return current;

  const latest = loadHistory()[0];

  if (!latest) return null;

  setCurrentResult(latest.result);
  return latest.result;
}
