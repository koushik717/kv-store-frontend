// DigitalOcean droplet node URLs
export const NODES = [
  {
    id: "node1",
    label: "Node 1",
    baseUrl: "http://157.230.83.134:8080",
    grpcPort: 9090,
  },
  {
    id: "node2",
    label: "Node 2",
    baseUrl: "http://157.230.83.134:8081",
    grpcPort: 9091,
  },
  {
    id: "node3",
    label: "Node 3",
    baseUrl: "http://157.230.83.134:8082",
    grpcPort: 9092,
  },
];


export const POLL_INTERVAL_MS = 2000;   // status refresh
export const METRICS_INTERVAL_MS = 5000; // metrics refresh
