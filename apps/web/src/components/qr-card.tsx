export function QrCard({ suffix }: { suffix: string }) {
  const cells = Array.from({ length: 81 }, (_, index) => (index * 7 + suffix.length * 3) % 5 !== 0);

  return (
    <section className="qr-card" aria-label="Opaque citizen QR pass">
      <div>
        <p className="eyebrow">My QR Pass</p>
        <h2>Present this QR to begin a disposal session</h2>
        <p>Safe display suffix: {suffix}. The QR contains no name, address, phone, balance, or role.</p>
      </div>
      <div className="qr-grid" aria-hidden="true">
        {cells.map((filled, index) => (
          <span key={index} className={filled ? "qr-cell-filled" : "qr-cell-empty"} />
        ))}
      </div>
    </section>
  );
}
