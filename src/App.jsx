import { useState } from "react";
import { useClusterStatus } from "./hooks/useClusterStatus";
import { useMetrics } from "./hooks/useMetrics";
import ClusterMap from "./components/ClusterMap";
import KvTerminal from "./components/KvTerminal";
import MetricsChart from "./components/MetricsChart";

export default function App() {
  const { statuses, leader, refresh } = useClusterStatus();
  const metricsHistory = useMetrics();
  const [opCount, setOpCount] = useState(0);

  const alive = statuses.filter((n) => !n.error && n.status).length;
  console.log("Current Leader:", leader);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>

      {/* ══════════ HEADER — matches mockup exactly ══════════ */}
      <header style={{ borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 32px" }}
             className="flex items-center justify-between">

          {/* Left — Title */}
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-white)", whiteSpace: "nowrap" }}>
            Distributed KV Store
          </h1>

          {/* Center — Stats row */}
          <div className="flex items-center" style={{ gap: 48 }}>
            {/* Live cluster status */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 4 }}>Live cluster status</div>
              <div className="flex items-center justify-center" style={{ gap: 8 }}>
                <span className="animate-pulse" style={{
                  width: 8, height: 8, borderRadius: "50%", display: "inline-block",
                  background: leader ? "var(--green)" : "var(--amber)",
                  boxShadow: leader ? "0 0 8px var(--green)" : "0 0 8px var(--amber)"
                }} />
                <span style={{ fontSize: 15, fontWeight: 600, color: leader ? "var(--green)" : "var(--amber)" }}>
                  {leader ? "Healthy" : "Electing"}
                </span>
              </div>
            </div>

            {/* Node count */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 4 }}>Node count</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-white)" }}>{alive}/3</div>
            </div>

            {/* Operations */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 4 }}>Operations</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-white)" }}>
                {opCount}
              </div>
            </div>
          </div>

          {/* Right — GitHub icon */}
          <a href="https://github.com/koushik717/distributed-kv-store"
             target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--text-light)">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
        </div>
      </header>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>

        {/* ── Row 1: Three node cards side by side */}
        <ClusterMap statuses={statuses} leader={leader} onRefresh={refresh} />

        {/* ── Row 2: Terminal + Chart side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 40 }}>
          <KvTerminal leader={leader} onOperation={() => setOpCount((c) => c + 1)} />
          <MetricsChart history={metricsHistory} />
        </div>

        {/* ── Row 3: Endpoint links */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 40 }}>
          {[
            { label: "Node 1 endpoint link", url: "https://node1-production-ad3d.up.railway.app" },
            { label: "Node 2 endpoint link", url: "https://node2-production-64d4.up.railway.app" },
            { label: "Node 3 endpoint link", url: "https://node3-production-114c.up.railway.app" },
          ].map(({ label, url }) => (
            <a key={label} href={`${url}/admin/status`} target="_blank" rel="noreferrer"
               className="endpoint-link">
              <span>{label}</span>
              <span>›</span>
            </a>
          ))}
        </div>
      </main>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ borderTop: "1px solid var(--border)", textAlign: "center", padding: "32px 0" }}>
        <p style={{ fontSize: 12, color: "var(--text-dim)" }}>Footer</p>
      </footer>
    </div>
  );
}
