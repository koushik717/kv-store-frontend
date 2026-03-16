export default function NodeCard({ node }) {
  const { status, error, loading, label } = node;

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 animate-pulse backdrop-blur-sm">
        <div className="h-3 w-16 bg-slate-700 rounded-full mb-4" />
        <div className="h-7 w-24 bg-slate-700 rounded-full mb-6" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 bg-slate-800 rounded-xl" />
          <div className="h-10 bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="relative rounded-2xl border border-red-900/60 bg-red-950/20 p-5 backdrop-blur-sm overflow-hidden">
        {/* Subtle red glow in corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">{label}</span>
        </div>
        <p className="text-2xl font-bold text-red-400 mt-2 mb-1 tracking-tight">UNREACHABLE</p>
        <p className="text-xs text-red-900 font-mono">node may be down · re-electing</p>
      </div>
    );
  }

  const isLeader = status.state === "LEADER";
  const isFollower = status.state === "FOLLOWER";
  const isCandidate = status.state === "CANDIDATE";

  const cardStyle = isLeader
    ? "border-emerald-500/40 bg-emerald-950/20"
    : isFollower
    ? "border-blue-500/30 bg-blue-950/10"
    : "border-yellow-500/40 bg-yellow-950/20";

  const glowStyle = isLeader
    ? "bg-emerald-500/15"
    : isFollower
    ? "bg-blue-500/10"
    : "bg-yellow-500/15";

  const stateColor = isLeader
    ? "text-emerald-400"
    : isFollower
    ? "text-blue-400"
    : "text-yellow-400";

  const dotColor = isLeader
    ? "bg-emerald-400"
    : isFollower
    ? "bg-blue-400"
    : "bg-yellow-400";

  const badgeStyle = isLeader
    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
    : isFollower
    ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
    : "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";

  return (
    <div className={`relative rounded-2xl border ${cardStyle} p-5 backdrop-blur-sm overflow-hidden transition-all duration-500`}>
      {/* Corner glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${glowStyle} rounded-full blur-3xl pointer-events-none`} />

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`relative w-2.5 h-2.5 rounded-full ${dotColor} ${isLeader || isCandidate ? "animate-pulse" : ""}`}>
            {(isLeader || isCandidate) && (
              <div className={`absolute inset-0 rounded-full ${dotColor} opacity-40 animate-ping`} />
            )}
          </div>
          <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">{label}</span>
        </div>
        <span className="text-xs font-mono text-slate-600">term {status.term}</span>
      </div>

      {/* State */}
      <div className="mb-5">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest border ${badgeStyle} uppercase`}>
          {isLeader && <span>★</span>}
          {status.state}
        </span>
        <p className={`text-3xl font-black mt-2 ${stateColor} tracking-tight leading-none`}>
          {label}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
          <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest mb-1">Commit Index</p>
          <p className="text-lg font-black text-slate-200 font-mono">{status.commitIndex}</p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
          <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest mb-1">Leader</p>
          <p className="text-sm font-bold text-slate-300 font-mono truncate">
            {status.leader === "unknown" ? "—" : status.leader}
          </p>
        </div>
      </div>
    </div>
  );
}
