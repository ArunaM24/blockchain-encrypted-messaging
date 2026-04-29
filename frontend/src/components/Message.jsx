export default function Message({ text, mine }) {
  return (
    <div style={{ textAlign: mine ? "right" : "left" }}>
      <p>{text}</p>
    </div>
  );
}
