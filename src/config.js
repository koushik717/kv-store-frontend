// Your Railway node URLs
export const NODES = [
  {
    id: "node1",
    label: "Node 1",
    baseUrl: "https://node1-production-ad3d.up.railway.app",
    grpcPort: 9090,
  },
  {
    id: "node2",
    label: "Node 2",
    baseUrl: "https://node2-production-5645.up.railway.app",
    grpcPort: 9091,
  },
  {
    id: "node3",
    label: "Node 3",
    baseUrl: "https://node3-production-114c.up.railway.app",
    grpcPort: 9092,
  },
];

export const POLL_INTERVAL_MS = 2000;   // status refresh
export const METRICS_INTERVAL_MS = 5000; // metrics refresh
