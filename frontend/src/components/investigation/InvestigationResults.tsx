import { ArrowUpRight, FileText, ShieldCheck } from "lucide-react";
import { formatPublishedDate } from "../../lib/dates";
import { getSafeUrl } from "../../lib/urls";
import {
  assessmentLabels,
  type InvestigationResult,
} from "../../types/investigation";

export function InvestigationResults({
  result,
}: {
  result: InvestigationResult;
}) {
  const label = assessmentLabels[result.overall_assessment];

  const isQuotaExceeded = result.status === "quota_exceeded";

  const isUnavailable =
    result.status === "analysis_unavailable" ||
    result.status === "search_unavailable" ||
    isQuotaExceeded;

  const isEmpty =
    result.status === "no_sources" || result.source_count === 0;

  return (
    <section className="investigation-results" aria-live="polite">
      <div className="results-heading">
        <div>
          <span className="section-kicker">INVESTIGATION REPORT</span>
          <h3>What the evidence suggests</h3>
        </div>

        <span
          className={`assessment-badge assessment-${result.overall_assessment}`}
        >
          {label}
        </span>
      </div>

      <div className="results-claim">
        <span>CLAIM EXAMINED</span>
        <p>{result.claim}</p>
      </div>

      {isUnavailable ? (
        <p className="results-warning" role="status">
          {isQuotaExceeded
            ? "The Gemini API daily quota has been reached. Sources were retrieved, but AI evidence analysis could not be completed. Please try again after your quota resets."
            : result.status === "search_unavailable"
              ? "Sources could not be retrieved from the search provider. No completed evidence assessment is available."
              : "Automated evidence analysis was unavailable. The retrieved sources are shown below, but their evidence labels should not be treated as a completed assessment."}
        </p>
      ) : null}

      {isEmpty ? (
        <p className="results-empty">
          No sources were returned for this investigation. Try rephrasing
          the claim or using more specific terms.
        </p>
      ) : (
        <>
          <div className="results-summary">
            <h4>Summary</h4>
            <p>{result.summary}</p>
          </div>

          <div className="results-meta">
            <span>
              <FileText size={15} />
              {result.source_count} source
              {result.source_count === 1 ? "" : "s"} retrieved
            </span>

            {result.assessment_method ? (
              <span>
                Method: {result.assessment_method.replaceAll("_", " ")}
              </span>
            ) : null}
          </div>

          <div className="results-source-list">
            <h4>Evidence sources</h4>

            {result.sources.map((source, index) => {
              const safeUrl = getSafeUrl(source.url);
              const publishedDate = formatPublishedDate(
                source.published_date,
              );

              return (
                <article
                  className="evidence-result-card"
                  key={`${source.url ?? source.title ?? "source"}-${index}`}
                >
                  <div className="evidence-result-top">
                    <span
                      className={`evidence-label evidence-label-${source.evidence_label}`}
                    >
                      {assessmentLabels[source.evidence_label] ??
                        "Evidence not classified"}
                    </span>

                    {publishedDate ? (
                      <span className="evidence-date">
                        Published {publishedDate}
                      </span>
                    ) : null}
                  </div>

                  <h5>
                    {safeUrl ? (
                      <a
                        href={safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.title || safeUrl}
                        <ArrowUpRight size={15} />
                      </a>
                    ) : (
                      source.title || "Untitled source"
                    )}
                  </h5>

                  {source.snippet ? (
                    <p className="evidence-snippet">{source.snippet}</p>
                  ) : null}

                  {source.reasoning ? (
                    <p className="evidence-reasoning">
                      <strong>Why this label?</strong> {source.reasoning}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </>
      )}

      {result.limitations.length > 0 ? (
        <div className="results-limitations">
          <h4>
            <ShieldCheck size={17} />
            Limitations and uncertainty
          </h4>

          <ul>
            {result.limitations.map((limitation, index) => (
              <li key={`${index}-${limitation}`}>{limitation}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
