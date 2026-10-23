export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Investigate the claim",
      description:
        "Start with a headline, statement, or question you want to understand.",
    },
    {
      number: "02",
      title: "Examine the sources",
      description:
        "Explore credible sources and compare supporting and contradicting evidence.",
    },
    {
      number: "03",
      title: "Understand the result",
      description:
        "Review the findings, source references, and what remains uncertain.",
    },
  ];

  return (
    <aside className="process-panel" id="how-it-works">
      <div className="process-heading">
        <span className="heading-dot" />
        A CLEARER WAY TO THINK
      </div>

      {steps.map((step) => (
        <div className="process-step" key={step.number}>
          <div className="step-number">{step.number}</div>
          <div className="step-content">
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
    </aside>
  );
}
