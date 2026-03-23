// Vercel proxy URLs (rewrites in vercel.json proxy to DigitalOcean droplet)
export const NODES = [
  {
    id: "node1",
    label: "Node 1",
    baseUrl: "/api/kv1",
    grpcPort: 9090,
  },
  {
    id: "node2",
    label: "Node 2",
    baseUrl: "/api/kv2",
    grpcPort: 9091,
  },
  {
    id: "node3",
    label: "Node 3",
    baseUrl: "/api/kv3",
    grpcPort: 9092,
  },
];



export const POLL_INTERVAL_MS = 2000;   // status refresh
export const METRICS_INTERVAL_MS = 5000; // metrics refresh
