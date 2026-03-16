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

  function handleOperation() {
    setOpCount((c) => c + 1);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              ⚡ Distributed KV Store
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Raft Consensus · 3-Node Cluster · Java 21
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>
              {leader
                ? `Leader: ${leader.label}`
                : "Electing..."}
            </span>
            <span>{opCount} ops this session</span>
            <a
              href="https://github.com/koushik717/distributed-kv-store"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <ClusterMap statuses={statuses} onRefresh={refresh} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <KvTerminal leader={leader} onOperation={handleOperation} />
          <MetricsChart history={metricsHistory} />
        </div>

        <section className="border border-slate-800 rounded-xl p-6 bg-slate-900">
          <h2 className="text-lg font-bold mb-4">How Raft Works Here</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-400">
            <div>
              <p className="text-green-400 font-semibold mb-1">Leader Election</p>
              <p>Nodes use randomized timeouts (150–300ms). First to timeout becomes Candidate, requests votes. Majority wins.</p>
            </div>
            <div>
              <p className="text-blue-400 font-semibold mb-1">Log Replication</p>
              <p>All writes go to the Leader. Leader appends to log, replicates to followers. Committed once majority ACK.</p>
            </div>
            <div>
              <p className="text-yellow-400 font-semibold mb-1">Crash Recovery</p>
              <p>WAL (Write-Ahead Log) persists every command to disk before ACKing. State fully rebuilt on restart.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-600">
        Built by Venkata Koushik Nakka · M.S. Computer Science, Indiana University ·{" "}
        <a href="https://koushik717.github.io" className="text-slate-500 hover:text-slate-300">
          Portfolio
        </a>
      </footer>
    </div>
  );
}
