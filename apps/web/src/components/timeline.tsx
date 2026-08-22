export function Timeline({ title, steps, active }: { title: string; steps: string[]; active: string }) {
  return (
    <section className="timeline-panel">
      <h3>{title}</h3>
      <ol>
        {steps.map((step) => (
          <li key={step} className={step === active ? "active-step" : ""}>
            <span aria-hidden="true" />
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
