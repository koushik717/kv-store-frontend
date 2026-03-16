import NodeCard from "./NodeCard";

export default function ClusterMap({ statuses, onRefresh }) {
  const leaderCount = statuses.filter((n) => n.status?.state === "LEADER").length;
  const aliveCount = statuses.filter((n) => !n.error && n.status).length;

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-mono text-slate-500 tracking-widest uppercase mb-1">
            Cluster Status
          </h2>
          <div className="flex items-center gap-2">
            {leaderCount === 1 ? (
              <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Healthy · {aliveCount}/3 nodes alive
              </span>
            ) : leaderCount === 0 ? (
              <span className="flex items-center gap-1.5 text-yellow-400 text-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping inline-block" />
                Election in progress…
              </span>
            ) : (
              <span className="text-red-400 text-sm font-semibold">⚠ Split brain detected</span>
            )}
          </div>
        </div>

        <button
          onClick={onRefresh}
          className="group flex items-center gap-1.5 text-xs font-mono text-slate-600 
                     hover:text-slate-300 border border-slate-800 hover:border-slate-600 
                     rounded-lg px-3 py-1.5 transition-all duration-200"
        >
          <span className="group-hover:rotate-180 transition-transform duration-500 inline-block">↺</span>
          Refresh
        </button>
      </div>

      {/* Node cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {statuses.map((node) => (
          <NodeCard key={node.id} node={node} />
        ))}
      </div>
    </section>
  );
}
