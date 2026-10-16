function SummaryCard({ label, value, tone }) {
  return (
    <article className={`summary-card summary-card-${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

export default SummaryCard;
