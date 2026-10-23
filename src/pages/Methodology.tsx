import { Link } from "react-router-dom";
import {
  FileSearch,
  ListChecks,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

const stages = [
  {
    icon: Search,
    title: "1. Claim submission",
    body: "You enter a claim, headline, or question (8–500 characters). The frontend validates length before sending a POST request to /api/investigate with a single claim field.",
  },
  {
    icon: FileSearch,
    title: "2. Source retrieval",
    body: "The backend queries a web search provider (Exa) for relevant sources. Each source may include a title, URL, publication date, and snippet. If no sources are found, the report returns an inconclusive assessment with an empty source list.",
  },
  {
    icon: Sparkles,
    title: "3. Evidence analysis",
    body: "When sources are available, the backend asks Gemini to assess each source against the specific claim using only the supplied metadata and snippets. The model is instructed not to invent facts, quotations, or findings.",
  },
  {
    icon: Scale,
    title: "4. Overall assessment",
    body: "Zevrith produces one overall label for the claim as a whole: supporting, contradicting, mixed, or inconclusive. This reflects the retrieved evidence collectively—not a definitive verdict that the claim is true or false.",
  },
  {
    icon: ListChecks,
    title: "5. Source-level reasoning",
    body: "Every source receives its own evidence label plus a short explanation grounded in that source’s title and snippet. Labels describe how that source relates to the claim, not the author’s reputation.",
  },
  {
    icon: ShieldAlert,
    title: "6. Uncertainty and limitations",
    body: "Reports include limitations such as snippet-only context, incomplete retrieval, and the fact that labels are AI-assisted assessments. If search or Gemini fails (including quota exhaustion), Zevrith still returns a structured result and states what could not be completed.",
  },
];

const labels = [
  {
    key: "supports",
    title: "Supporting",
    body: "The source’s available text tends to affirm or corroborate the claim.",
  },
  {
    key: "contradicts",
    title: "Contradicting",
    body: "The source’s available text tends to challenge or undermine the claim.",
  },
  {
    key: "mixed",
    title: "Mixed evidence",
    body: "The source presents partial support and partial opposition, or nuanced findings that do not point clearly one way.",
  },
  {
    key: "inconclusive",
    title: "Inconclusive",
    body: "The snippet is insufficient, ambiguous, or only loosely related—so no clear stance can be assigned.",
  },
];

export default function Methodology() {
  return (
    <main className="page-section">
      <div className="page-panel methodology-panel">
        <span className="section-kicker">HOW ZEVRITH WORKS</span>
        <h2>Investigation methodology</h2>
        <p className="section-subtitle">
          Zevrith is an evidence-intelligence tool: it retrieves sources,
          asks an AI model to classify how those sources relate to your
          claim, and surfaces limitations honestly. It does not claim
          scientific proof, independent verification, or confidence scores.
        </p>

        <div className="methodology-grid">
          {stages.map((stage) => {
            const Icon = stage.icon;

            return (
              <article className="methodology-card" key={stage.title}>
                <div className="methodology-icon" aria-hidden="true">
                  <Icon size={20} />
                </div>
                <h3>{stage.title}</h3>
                <p>{stage.body}</p>
              </article>
            );
          })}
        </div>

        <section className="methodology-labels" aria-labelledby="labels-heading">
          <h3 id="labels-heading">Evidence labels</h3>
          <p>
            Each label describes the relationship between a source snippet
            and the claim under investigation.
          </p>

          <div className="label-explainer-grid">
            {labels.map((item) => (
              <div className="label-explainer" key={item.key}>
                <span
                  className={`evidence-label evidence-label-${item.key}`}
                >
                  {item.title}
                </span>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="methodology-caveat" aria-labelledby="caveat-heading">
          <h3 id="caveat-heading">What this is not</h3>
          <ul>
            <li>
              Retrieved sources can be incomplete, outdated, duplicated, or
              poorly matched to the claim.
            </li>
            <li>
              AI-generated assessments can be incorrect. Snippets may omit
              important context from full articles.
            </li>
            <li>
              Zevrith does not rank sources by authority, produce confidence
              percentages, or independently verify primary research.
            </li>
            <li>
              When Gemini quota or analysis fails, sources may still appear
              with inconclusive labels—treat those as unfinished analysis,
              not a completed judgment.
            </li>
          </ul>
        </section>

        <div className="page-actions">
          <Link className="button button-primary" to="/">
            Investigate a claim
          </Link>
        </div>
      </div>
    </main>
  );
}
