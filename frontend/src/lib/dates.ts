export function formatPublishedDate(
  value: string | null,
): string | null {
  if (!value) return null;

  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) return null;

  const date = new Date(timestamp);

  // Hide dates that are in the future.
  if (date.getTime() > Date.now()) return null;

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatSavedAt(value: string): string {
  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) return "Unknown date";

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
