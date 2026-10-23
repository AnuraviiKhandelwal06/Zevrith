import {
  CheckCircle2,
  CircleHelp,
  FileText,
  UserRound,
  X,
} from "lucide-react";

export function SourceCard({
  type,
  title,
  subtitle,
  className,
}: {
  type: "support" | "against" | "unclear";
  title: string;
  subtitle: string;
  className: string;
}) {
  const Icon = type === "unclear" ? UserRound : FileText;

  const StatusIcon =
    type === "support"
      ? CheckCircle2
      : type === "against"
        ? X
        : CircleHelp;

  const label =
    type === "support"
      ? "Supporting"
      : type === "against"
        ? "Contradicting"
        : "Inconclusive";

  return (
    <div className={`source-card ${className}`}>
      <div className="source-icon">
        <Icon size={18} />
      </div>

      <div className="source-copy">
        <strong>{title}</strong>
        <span>{subtitle}</span>
        <em className={`source-status ${type}`}>
          <StatusIcon size={12} />
          {label}
        </em>
      </div>
    </div>
  );
}
