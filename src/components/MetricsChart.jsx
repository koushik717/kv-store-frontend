import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

/* Seed some initial data so the chart isn't empty on load */
const SEED = [
  { time: "0s", reads: 4, writes: 2 },
  { time: "5s", reads: 6, writes: 3 },
  { time: "10s", reads: 5, writes: 5 },
  { time: "15s", reads: 8, writes: 4 },
  { time: "20s", reads: 7, writes: 6 },
  { time: "25s", reads: 10, writes: 5 },
  { time: "30s", reads: 9, writes: 8 },
  { time: "35s", reads: 12, writes: 7 },
  { time: "40s", reads: 11, writes: 9 },
];

export default function MetricsChart({ history }) {
  const data = history.length > 0 ? history : SEED;

  return (
    <div className="chart-container" style={{ display: "flex", flexDirection: "column" }}>
      {/* Legend — top right like mockup */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16, padding: "14px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-mid)" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--blue)", display: "inline-block" }} />
          Reads
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-mid)" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
          Writes
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, padding: "8px 12px 12px" }}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gReads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4facfe" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#4facfe" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gWrites" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00e68a" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#00e68a" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: "var(--text-dim)", fontSize: 9, fontFamily: "JetBrains Mono" }}
              axisLine={{ stroke: "rgba(255,255,255,0.04)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-dim)", fontSize: 9, fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                background: "#0f1628",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: "#f0f4f8",
                fontFamily: "JetBrains Mono",
                fontSize: 11,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            />
            <Area type="monotone" dataKey="reads" stroke="#4facfe" strokeWidth={2}
                  fill="url(#gReads)" dot={false}
                  activeDot={{ r: 4, fill: "#4facfe", strokeWidth: 0 }} />
            <Area type="monotone" dataKey="writes" stroke="#00e68a" strokeWidth={2}
                  fill="url(#gWrites)" dot={false}
                  activeDot={{ r: 4, fill: "#00e68a", strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
