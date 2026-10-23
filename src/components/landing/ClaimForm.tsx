import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useInvestigationSession } from "../../hooks/useInvestigationSession";
import { investigateClaim } from "../../services/investigateApi";

const examples = [
  "Does drinking coffee improve concentration?",
  "Is electric vehicle battery recycling effective?",
  "Can AI-generated images be reliably detected?",
];

export function ClaimForm() {
  const navigate = useNavigate();
  const { setResultFromInvestigation } = useInvestigationSession();
  const [claim, setClaim] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    const submittedClaim = claim.trim();

    if (submittedClaim.length < 8) {
      setNotice(
        "Enter a more specific claim (at least 8 characters).",
      );
      return;
    }

    if (submittedClaim.length > 500) {
      setNotice("Keep your claim within 500 characters.");
      return;
    }

    setIsLoading(true);
    setNotice("");

    try {
      const parsedResult = await investigateClaim(submittedClaim);
      setResultFromInvestigation(parsedResult);
      navigate("/results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function selectExample(example: string) {
    setClaim(example);
    setNotice("");

    document.getElementById("claim-input")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    document.getElementById("claim-input")?.focus();
  }

  return (
    <>
      <form className="claim-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="claim-input">
          Claim or question to investigate
        </label>

        <input
          id="claim-input"
          value={claim}
          maxLength={500}
          disabled={isLoading}
          onChange={(event) => {
            setClaim(event.target.value);
            setNotice("");
          }}
          placeholder="Enter a claim, headline, or question you want to examine..."
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading-spinner" aria-hidden="true" />
              Investigating...
            </>
          ) : (
            <>
              <Search size={18} />
              Investigate claim
            </>
          )}
        </button>
      </form>

      {isLoading ? (
        <p className="form-notice" role="status">
          Searching for sources and analysing available evidence. This may
          take a little while...
        </p>
      ) : null}

      {notice ? (
        <p className="form-notice" role="alert">
          {notice}
        </p>
      ) : null}

      <div className="examples">
        <span>Try an example:</span>

        {examples.map((example) => (
          <button
            type="button"
            key={example}
            disabled={isLoading}
            onClick={() => selectExample(example)}
          >
            {example}
          </button>
        ))}
      </div>
    </>
  );
}
