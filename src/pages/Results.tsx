import { Link } from "react-router-dom";
import { ArrowRight, History, Home } from "lucide-react";
import { InvestigationResults } from "../components/investigation/InvestigationResults";
import { useInvestigationSession } from "../hooks/useInvestigationSession";

export default function Results() {
  const { result, clearResult } = useInvestigationSession();

  if (!result) {
    return (
      <main className="page-section">
        <div className="page-panel empty-state">
          <span className="section-kicker">NO REPORT YET</span>
          <h2>No investigation to show</h2>
          <p>
            Submit a claim from Home, or reopen a saved investigation from
            History. Refreshing this page will restore the latest available
            report when one exists.
          </p>

          <div className="page-actions">
            <Link className="button button-primary" to="/">
              <Home size={18} />
              Go to Home
            </Link>
            <Link className="button button-secondary" to="/history">
              <History size={18} />
              Open History
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="investigation-section results-page"
      aria-label="Investigation results"
    >
      <div className="investigation-main results-main">
        <div className="page-actions results-actions">
          <Link
            className="button button-secondary"
            to="/"
            onClick={() => clearResult()}
          >
            <ArrowRight size={18} />
            Investigate another claim
          </Link>

          <Link className="button button-secondary" to="/">
            <Home size={18} />
            Return home
          </Link>
        </div>

        <InvestigationResults result={result} />
      </div>
    </main>
  );
}
