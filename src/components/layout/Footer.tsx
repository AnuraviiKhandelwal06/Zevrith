import { Link } from "react-router-dom";
import { Activity, ArrowDownRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer">
      <Link className="footer-brand" to="/">
        <span className="brand-mark brand-mark-small">
          <Activity size={16} />
        </span>

        <span>
          Signal<span className="brand-accent">IQ</span>
        </span>
      </Link>

      <span className="footer-tagline">
        Look beyond the headline. Follow the evidence.
      </span>

      <button
        type="button"
        className="back-to-top"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        Back to top
        <ArrowDownRight size={14} />
      </button>
    </footer>
  );
}
