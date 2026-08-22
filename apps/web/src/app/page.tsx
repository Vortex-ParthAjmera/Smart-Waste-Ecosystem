/**
 * apps/web/src/app/page.tsx
 * Home page — redirects to appropriate role dashboard.
 *
 * Owner: YASHVARDHAN DOBHAL
 */

export default function HomePage() {
  return (
    <main>
      <h1>Smart Waste Ecosystem</h1>
      <p>SGV 2.0 — Auditable waste segregation platform</p>
      <nav>
        <ul>
          <li><a href="/citizen">Citizen Portal</a></li>
          <li><a href="/municipal/operator">Municipal Operator</a></li>
          <li><a href="/municipal/review">Municipal Review</a></li>
          <li><a href="/developer">Developer Dashboard</a></li>
        </ul>
      </nav>
    </main>
  );
}
