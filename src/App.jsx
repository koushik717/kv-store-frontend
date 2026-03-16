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

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 relative overflow-x-hidden">

      {/* Background grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), 
                            linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Background gradient orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── HEADER */}
      <header className="relative border-b border-slate-800/60 backdrop-blur-md bg-[#060b14]/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 
                              flex items-center justify-center text-emerald-400 text-lg">
                ⚡
              </div>
              {leader && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 
                                 rounded-full border-2 border-[#060b14] animate-pulse" />
              )}
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-slate-100">
                Distributed KV Store
              </h1>
              <p className="text-[11px] font-mono text-slate-600">
                Raft Consensus · Java 21 · 3-Node Cluster
              </p>
            </div>
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border
              ${leader
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
              }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${leader ? "bg-emerald-400 animate-pulse" : "bg-yellow-400 animate-ping"}`} />
              {leader ? `${leader.label} leading` : "electing…"}
            </div>

            <div className="px-3 py-1.5 rounded-full text-xs font-mono border border-slate-800 text-slate-600">
              {opCount} ops
            </div>

            <a
              href="https://github.com/koushik717/distributed-kv-store"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono
                         border border-slate-800 text-slate-500 hover:text-slate-300 
                         hover:border-slate-600 transition-all duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* ── MAIN */}
      <main className="relative max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Cluster map */}
        <ClusterMap statuses={statuses} onRefresh={refresh} />

        {/* Divider */}
        <div className="border-t border-slate-800/40" />

        {/* Terminal + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <KvTerminal leader={leader} onOperation={() => setOpCount((c) => c + 1)} />
          <MetricsChart history={metricsHistory} />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/40" />

        {/* How it works */}
        <section>
          <h2 className="text-sm font-mono text-slate-500 tracking-widest uppercase mb-5">
            How Raft Works Here
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                color: "emerald",
                icon: "★",
                title: "Leader Election",
                body: "Nodes use randomized timeouts (150–300ms). First to time out becomes Candidate and requests votes. Majority wins — any single node failure triggers automatic re-election.",
              },
              {
                color: "blue",
                icon: "⟳",
                title: "Log Replication",
                body: "All writes go to the Leader only. Leader appends to its log, replicates to followers via AppendEntries RPC. Entry is committed once a majority ACK — then applied to state machine.",
              },
              {
                color: "violet",
                icon: "◈",
                title: "Crash Recovery",
                body: "Write-Ahead Log (WAL) persists every committed command to disk before ACKing the client. On restart, the node replays the WAL to fully reconstruct state — zero data loss.",
              },
            ].map(({ color, icon, title, body }) => (
              <div
                key={title}
                className={`rounded-2xl border border-${color}-500/20 bg-${color}-950/10 p-5`}
              >
                <div className={`text-${color}-400 text-xl mb-3`}>{icon}</div>
                <h3 className={`font-bold text-${color}-300 mb-2 text-sm`}>{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Live URLs */}
        <section>
          <h2 className="text-sm font-mono text-slate-500 tracking-widest uppercase mb-4">
            Live Nodes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Node 1", url: "https://node1-production-ad3d.up.railway.app" },
              { label: "Node 2", url: "https://node2-production-64d4.up.railway.app" },
              { label: "Node 3", url: "https://node3-production-114c.up.railway.app" },
            ].map(({ label, url }) => (
              <a
                key={label}
                href={`${url}/admin/status`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-800 
                           bg-slate-900/40 px-4 py-3 text-xs font-mono text-slate-500 
                           hover:border-slate-600 hover:text-slate-300 transition-all duration-200 group"
              >
                <span className="text-slate-400 font-semibold">{label}</span>
                <span className="truncate mx-3 text-slate-700 group-hover:text-slate-500 transition-colors">
                  {url.replace("https://", "")}
                </span>
                <span className="text-slate-700 group-hover:text-slate-400 transition-colors">↗</span>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* ── FOOTER */}
      <footer className="relative border-t border-slate-800/40 mt-16 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs font-mono text-slate-700">
          <span>Built by Venkata Koushik Nakka · M.S. CS, Indiana University · May 2026</span>
          <a
            href="https://koushik717.github.io"
            className="hover:text-slate-400 transition-colors"
          >
            koushik717.github.io ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
