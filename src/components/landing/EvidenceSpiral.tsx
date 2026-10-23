import { ArrowUpRight, FileText, Waves } from "lucide-react";
import { SourceCard } from "./SourceCard";

export function EvidenceSpiral() {
  return (
    <div
      className="orbit-scene"
      aria-label="Zevrith visualising a claim, its sources, and the evidence"
    >
      <div className="scene-glow" />

      <div className="orbit-grid">
        <div className="orbit orbit-one">
          <span className="orbit-dot dot-one" />
        </div>
        <div className="orbit orbit-two">
          <span className="orbit-dot dot-two" />
        </div>
        <div className="orbit orbit-three">
          <span className="orbit-dot dot-three" />
        </div>
        <div className="orbit orbit-four">
          <span className="orbit-dot dot-four" />
        </div>
        <div className="orbit orbit-five">
          <span className="orbit-dot dot-five" />
        </div>

        <div className="orbit-node node-a" />
        <div className="orbit-node node-b" />
        <div className="orbit-node node-c" />
        <div className="orbit-node node-d" />

        <span className="sparkle sparkle-one">✦</span>
        <span className="sparkle sparkle-two">✧</span>
        <span className="sparkle sparkle-three">✦</span>
        <span className="sparkle sparkle-four">✧</span>

        <div className="signal-core">
          <div className="core-halo" />
          <div className="core-inner">
            <Waves size={38} strokeWidth={1.7} />
          </div>
          <span className="core-label">SIGNAL CORE</span>
        </div>
      </div>

      <div className="claim-bubble">
        <span className="claim-label">
          <span className="live-dot" />
          CLAIM UNDER INVESTIGATION
        </span>
        <strong>
          Does drinking coffee
          <br />
          improve concentration?
        </strong>
      </div>

      <SourceCard
        type="support"
        title="Research Paper"
        subtitle="Illustrative example"
        className="source-card-one"
      />

      <SourceCard
        type="against"
        title="News Article"
        subtitle="Illustrative example"
        className="source-card-two"
      />

      <SourceCard
        type="unclear"
        title="Expert Opinion"
        subtitle="Illustrative example"
        className="source-card-three"
      />

      <div className="mini-document mini-doc-one">
        <FileText size={14} />
      </div>
      <div className="mini-document mini-doc-two">
        <FileText size={14} />
      </div>
      <div className="mini-document mini-doc-three">
        <FileText size={14} />
      </div>

      <div className="report-card">
        <div className="report-heading">
          <div className="report-icon">
            <FileText size={17} />
          </div>
          <div>
            <strong>Research Summary</strong>
            <span>Illustrative preview</span>
          </div>
          <span className="report-indicator" />
        </div>

        <div className="report-divider" />

        <div className="report-row">
          <span className="evidence-dot evidence-green" />
          <span>Supporting</span>
          <small>Evidence</small>
        </div>
        <div className="report-row">
          <span className="evidence-dot evidence-red" />
          <span>Contradicting</span>
          <small>Evidence</small>
        </div>
        <div className="report-row">
          <span className="evidence-dot evidence-amber" />
          <span>Inconclusive</span>
          <small>Evidence</small>
        </div>

        <div className="report-footer">
          <span>Evidence breakdown</span>
          <ArrowUpRight size={14} />
        </div>
      </div>

      <div className="orbit-caption">
        <span className="caption-pulse" />
        EXPLORING THE EVIDENCE
      </div>
    </div>
  );
}
