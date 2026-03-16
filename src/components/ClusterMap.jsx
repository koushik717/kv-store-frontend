import NodeCard from "./NodeCard";

export default function ClusterMap({ statuses, leader, onRefresh }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
      {statuses.map((node) => (
        <NodeCard key={node.id} node={node} />
      ))}
    </div>
  );
}
