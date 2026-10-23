
import type { HistoryEntry } from "../types/investigation";

const API_BASE_URL = "http://127.0.0.1:8000";

type HistoryResponse = {
  entries: HistoryEntry[];
  limit: number;
  offset: number;
};

type HistoryImportResponse = {
  message: string;
  imported: number;
  skipped: number;
};

async function readError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.detail ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export async function fetchHistory(): Promise<HistoryEntry[]> {
  const response = await fetch(`${API_BASE_URL}/api/history`);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const data: HistoryResponse = await response.json();
  return data.entries;
}

export async function importHistoryToApi(
  entries: HistoryEntry[],
): Promise<HistoryImportResponse> {
  const response = await fetch(`${API_BASE_URL}/api/history/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ entries }),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
}

export async function deleteHistoryFromApi(id: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/history/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}

export async function clearHistoryFromApi(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/history`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}
