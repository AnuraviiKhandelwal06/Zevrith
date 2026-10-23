
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { History as HistoryIcon, Search, Trash2 } from "lucide-react";
import { formatSavedAt } from "../lib/dates";
import {
  clearHistoryFromApi,
  deleteHistoryFromApi,
  fetchHistory,
  importHistoryToApi,
} from "../lib/api";
import { loadHistory } from "../lib/history";
import { useInvestigationSession } from "../hooks/useInvestigationSession";
import {
  assessmentLabels,
  type HistoryEntry,
} from "../types/investigation";

const HISTORY_MIGRATION_KEY = "zevrith:postgres-history-migrated:v1";

export default function History() {
  const navigate = useNavigate();
  const { setResultFromHistory } = useInvestigationSession();

  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageNotice, setStorageNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEntries() {
      try {
        // Migrate old browser history only once.
        const alreadyMigrated =
          localStorage.getItem(HISTORY_MIGRATION_KEY) === "true";

        if (!alreadyMigrated) {
          const oldEntries = loadHistory();

          if (oldEntries.length > 0) {
            await importHistoryToApi(oldEntries);
          }

          // Mark migration complete only after the import succeeds.
          localStorage.setItem(HISTORY_MIGRATION_KEY, "true");
        }

        // Load the complete history from PostgreSQL.
        const savedEntries = await fetchHistory();

        if (active) {
          setEntries(savedEntries);
          setStorageNotice("");
        }
      } catch (error) {
        if (active) {
          setStorageNotice(
            error instanceof Error
              ? `Could not load or migrate history: ${error.message}`
              : "Could not load investigation history.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadEntries();

    return () => {
      active = false;
    };
  }, []);

  function openEntry(entry: HistoryEntry) {
    setResultFromHistory(entry.result);
    navigate("/results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    setStorageNotice("");

    try {
      await deleteHistoryFromApi(id);

      setEntries((current) =>
        current.filter((entry) => entry.id !== id),
      );
    } catch (error) {
      setStorageNotice(
        error instanceof Error
          ? `Could not delete history entry: ${error.message}`
          : "Could not delete the history entry.",
      );
    }
  }

  async function handleClear() {
    const confirmed = window.confirm(
      "Clear all saved investigations from the database? This cannot be undone.",
    );

    if (!confirmed) return;

    setStorageNotice("");

    try {
      await clearHistoryFromApi();
      setEntries([]);
    } catch (error) {
      setStorageNotice(
        error instanceof Error
          ? `Could not clear history: ${error.message}`
          : "Could not clear investigation history.",
      );
    }
  }

  return (
    <main className="page-section">
      <div className="page-panel">
        <div className="page-header">
          <div>
            <span className="section-kicker">
              INVESTIGATION HISTORY
            </span>
            <h2>Previous investigations</h2>
            <p className="section-subtitle">
              Completed investigations are saved in PostgreSQL.
              Opening an entry shows the stored report without
              running the investigation again.
            </p>
          </div>

          {entries.length > 0 && !loading ? (
            <button
              type="button"
              className="button button-secondary danger-action"
              onClick={() => void handleClear()}
            >
              <Trash2 size={16} />
              Clear history
            </button>
          ) : null}
        </div>

        {storageNotice ? (
          <p className="form-notice" role="alert">
            {storageNotice}
          </p>
        ) : null}

        {loading ? (
          <div className="empty-state nested-empty">
            <HistoryIcon size={28} aria-hidden="true" />
            <h3>Loading investigations...</h3>
            <p>Retrieving saved reports from the database.</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="empty-state nested-empty">
            <HistoryIcon size={28} aria-hidden="true" />
            <h3>No saved investigations yet</h3>
            <p>
              When you complete an investigation, it will appear
              here so you can revisit it later.
            </p>
            <Link className="button button-primary" to="/">
              <Search size={18} />
              Investigate a claim
            </Link>
          </div>
        ) : (
          <ul className="history-list">
            {entries.map((entry) => {
              const summary =
                entry.result.summary.length > 160
                  ? `${entry.result.summary.slice(0, 157).trimEnd()}...`
                  : entry.result.summary;

              return (
                <li className="history-card" key={entry.id}>
                  <div className="history-card-top">
                    <span
                      className={`assessment-badge assessment-${entry.result.overall_assessment}`}
                    >
                      {
                        assessmentLabels[
                          entry.result.overall_assessment
                        ]
                      }
                    </span>

                    <time dateTime={entry.savedAt}>
                      {formatSavedAt(entry.savedAt)}
                    </time>
                  </div>

                  <h3>{entry.result.claim}</h3>
                  <p>{summary}</p>

                  <div className="history-card-actions">
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() => openEntry(entry)}
                    >
                      Open report
                    </button>

                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => void handleDelete(entry.id)}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
