export default function NodeCard({ node }) {
  const { status, error, loading, label } = node;

  /* Loading */
  if (loading) {
    return (
      <div className="node-card" style={{ minHeight: 200 }}>
        <div style={{ width: 60, height: 20, borderRadius: 6, background: "var(--text-ghost)", marginBottom: 16 }} />
        <div style={{ width: 80, height: 28, borderRadius: 8, background: "var(--text-ghost)", marginBottom: 16 }} />
        <div style={{ width: 100, height: 14, borderRadius: 4, background: "var(--text-ghost)", marginBottom: 8 }} />
        <div style={{ width: 120, height: 36, borderRadius: 8, background: "var(--text-ghost)", marginBottom: 8 }} />
        <div style={{ width: 50, height: 12, borderRadius: 4, background: "var(--text-ghost)" }} />
      </div>
    );
  }

  /* Unreachable */
  if (error || !status) {
    return (
      <div className="node-card error" style={{ minHeight: 200 }}>
        <div className="badge" style={{ background: "var(--red-soft)", color: "var(--red)" }}>
          UNREACHABLE
        </div>
        <p style={{ fontSize: 24, fontWeight: 700, color: "var(--text-white)", marginTop: 20 }}>{label}</p>
        <p className="mono" style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 8 }}>
          Connection failed · may be re-electing
        </p>
      </div>
    );
  }

  const isLeader = status.state === "LEADER";
  const isFollower = status.state === "FOLLOWER";

  const cardClass = isLeader ? "leader" : isFollower ? "follower" : "candidate";
  const badgeBg = isLeader ? "var(--green-soft)" : isFollower ? "var(--cyan-soft)" : "var(--amber-soft)";
  const badgeColor = isLeader ? "var(--green)" : isFollower ? "var(--cyan)" : "var(--amber)";

  return (
    <div className={`node-card ${cardClass}`} style={{ minHeight: 200, position: "relative", zIndex: 1 }}>
      {/* Explicit glow background element behind the card content */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: isLeader ? "radial-gradient(circle at 50% 0%, rgba(0,230,138,0.15), transparent 70%)" : 
                    isFollower ? "radial-gradient(circle at 50% 0%, rgba(79,172,254,0.12), transparent 70%)" :
                    "radial-gradient(circle at 50% 0%, rgba(245,158,11,0.1), transparent 70%)",
        zIndex: -1,
        borderRadius: "inherit",
        pointerEvents: "none"
      }} />

      {/* Top: Badge + Star */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div className="badge" style={{ background: badgeBg, color: badgeColor }}>
          {status.state}
        </div>
        {isLeader && (
          <span style={{ fontSize: 20, color: "var(--text-dim)", opacity: 0.4 }}>☆</span>
        )}
      </div>

      {/* Node name */}
      <p style={{ fontSize: 24, fontWeight: 700, color: "var(--text-white)", marginBottom: 16 }}>
        {label}
      </p>

      {/* Commit index label */}
      <p style={{ fontSize: 12, color: "var(--text-mid)", marginBottom: 4 }}>
        Commit index
      </p>

      {/* Commit index value — BIG */}
      <p className="mono" style={{ fontSize: 32, fontWeight: 800, color: "var(--text-white)", marginBottom: 8, lineHeight: 1.1 }}>
        {status.commitIndex}
      </p>

      {/* Term */}
      <p className="mono" style={{ fontSize: 11, color: "var(--text-dim)" }}>
        Term {status.term}
      </p>
    </div>
  );
}
