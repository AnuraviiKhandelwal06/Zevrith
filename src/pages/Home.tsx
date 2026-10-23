
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ClaimForm } from "../components/landing/ClaimForm";
import { EvidenceSpiral } from "../components/landing/EvidenceSpiral";
import { HowItWorks } from "../components/landing/HowItWorks";
import { useInvestigationSession } from "../hooks/useInvestigationSession";

export default function Home() {
  const { clearResult } = useInvestigationSession();

  useEffect(() => {
    clearResult();
  }, [clearResult]);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-badge">
            <Sparkles size={14} />
            INTELLIGENCE BEYOND THE HEADLINES
          </div>

          <h1>
            Every claim has a story.
            <br />
            <span>Find the signal.</span>
          </h1>

          <p className="hero-description">
            Big claims deserve more than quick answers. Explore credible
            sources, weigh conflicting evidence, and discover what the facts
            actually support.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#investigate">
              Investigate a claim
              <ArrowRight size={20} />
            </a>

            <a className="button button-secondary" href="#how-it-works">
              Explore the process
            </a>
          </div>

          <div className="trust-row">
            <span>
              <ShieldCheck size={18} />
              Evidence-first research
            </span>

            <span>
              <CheckCircle2 size={18} />
              Transparent sources
            </span>
          </div>
        </div>

        <EvidenceSpiral />
      </section>

      <section className="investigation-section" id="investigate">
        <div className="investigation-main">
          <div className="section-kicker">YOUR NEXT QUESTION STARTS HERE</div>

          <h2>What should we investigate?</h2>

          <p className="section-subtitle">
            Start with a claim. Follow the evidence wherever it leads.
          </p>

          <ClaimForm />

          <p className="section-footnote">
            Want the full pipeline explained? Read the{" "}
            <Link to="/methodology">methodology</Link>.
          </p>
        </div>

        <HowItWorks />
      </section>
    </main>
  );
}
