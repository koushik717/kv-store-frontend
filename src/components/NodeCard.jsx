export default function NodeCard({ node }) {
  const { status, error, loading, label } = node;

  const stateColor = {
    LEADER: "text-green-400 border-green-500 bg-green-500/10",
    FOLLOWER: "text-blue-400 border-blue-500 bg-blue-500/10",
    CANDIDATE: "text-yellow-400 border-yellow-500 bg-yellow-500/10",
  };

  const dotColor = {
    LEADER: "bg-green-400 animate-pulse",
    FOLLOWER: "bg-blue-400",
    CANDIDATE: "bg-yellow-400 animate-pulse",
  };

  if (loading) {
    return (
      <div className="border border-slate-700 rounded-xl p-4 bg-slate-800/50 animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-1/2 mb-2" />
        <div className="h-8 bg-slate-700 rounded w-1/3" />
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="border border-red-800 rounded-xl p-4 bg-red-900/20">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-sm text-slate-400">{label}</span>
        </div>
        <p className="text-red-400 font-bold text-lg">UNREACHABLE</p>
        <p className="text-xs text-slate-500 mt-1">Node may be down or electing</p>
      </div>
    );
  }

  const colorClass = stateColor[status.state] || "text-slate-400 border-slate-600";
  const dot = dotColor[status.state] || "bg-slate-400";

  return (
    <div className={`border rounded-xl p-4 ${colorClass}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dot}`} />
          <span className="text-sm text-slate-400">{label}</span>
        </div>
        <span className="text-xs text-slate-500">
          term {status.term}
        </span>
      </div>

      <p className="font-bold text-2xl mb-3">{status.state}</p>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
        <div>
          <p className="text-slate-500">Commit Index</p>
          <p className="font-mono text-slate-200">{status.commitIndex}</p>
        </div>
        <div>
          <p className="text-slate-500">Leader</p>
          <p className="font-mono text-slate-200 truncate">
            {status.leader === "unknown" ? "—" : status.leader}
          </p>
        </div>
      </div>
    </div>
  );
}
