# KV Store Frontend

A premium React dashboard for the [Distributed Key-Value Store](https://github.com/koushik717/distributed-kv-store) — featuring real-time cluster monitoring, an interactive KV terminal, and Raft consensus visualization.

## 🚀 Live

**Dashboard:** [kv-store-frontend.vercel.app](https://kv-store-frontend.vercel.app)

**Backend:** 3-node cluster on DigitalOcean at `157.230.83.134` (ports 8080, 8081, 8082)

## Features

- **Cluster Status Dashboard** — Real-time LEADER/FOLLOWER status for all 3 Raft nodes
- **Interactive KV Terminal** — PUT, GET, DELETE operations with response highlighting
- **Metrics Chart** — Live reads/writes throughput visualization
- **Node Endpoint Links** — One-click access to each node's admin status

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React 19 + Vite |
| Styling | Custom CSS (glassmorphism, dark navy theme) |
| Fonts | Inter + JetBrains Mono |
| Charts | Recharts |
| Deployment | Vercel |
| API Proxy | Vercel Rewrites → DigitalOcean Droplet |

## Architecture

```
Browser (HTTPS)
    ↓
Vercel (kv-store-frontend.vercel.app)
    ↓ /api/kv1/* → http://157.230.83.134:8080/*
    ↓ /api/kv2/* → http://157.230.83.134:8081/*
    ↓ /api/kv3/* → http://157.230.83.134:8082/*
DigitalOcean Droplet (3-node KV cluster)
```

Vercel's server-side proxying eliminates HTTPS mixed content issues.

## Running Locally

```bash
npm install
npm run dev
```

Update `src/config.js` to point to your backend if needed.
