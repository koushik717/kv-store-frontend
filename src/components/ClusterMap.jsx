import NodeCard from "./NodeCard";

export default function ClusterMap({ statuses, onRefresh }) {
  const leaderCount = statuses.filter(
    (n) => n.status?.state === "LEADER"
  ).length;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Cluster Status</h2>
          <p className="text-xs text-slate-500">
            {leaderCount === 1
              ? "✅ Cluster healthy — 1 leader elected"
              : leaderCount === 0
              ? "⚠️ No leader — election in progress"
              : "❌ Split brain — multiple leaders detected"}
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="text-xs text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-500 rounded px-3 py-1 transition-colors"
        >
          ↺ Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statuses.map((node) => (
          <NodeCard key={node.id} node={node} />
        ))}
      </div>
    </section>
  );
}
