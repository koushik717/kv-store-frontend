import axios from "axios";

const clients = {};
export function getClient(baseUrl) {
  if (!clients[baseUrl]) {
    clients[baseUrl] = axios.create({
      baseURL: baseUrl,
      timeout: 3000,
    });
  }
  return clients[baseUrl];
}

export async function fetchStatus(node) {
  const res = await getClient(node.baseUrl).get("/admin/status");
  return res.data;
}

export async function kvGet(leaderUrl, key) {
  const res = await getClient(leaderUrl).get(`/kv/${key}`);
  return res.data;
}

export async function kvPut(leaderUrl, key, value) {
  const res = await getClient(leaderUrl).put(`/kv/${key}`, { value });
  return res.data;
}

export async function kvDelete(leaderUrl, key) {
  await getClient(leaderUrl).delete(`/kv/${key}`);
  return { deleted: key };
}

export async function kvGetAll(leaderUrl) {
  const res = await getClient(leaderUrl).get("/kv");
  return res.data;
}

export async function fetchMetrics(node) {
  const res = await getClient(node.baseUrl).get("/actuator/prometheus");
  return res.data;
}

export function parseMetric(prometheusText, metricName) {
  const lines = prometheusText.split("\n");
  for (const line of lines) {
    if (line.startsWith(metricName) && !line.startsWith("#")) {
      const parts = line.split(" ");
      return parseFloat(parts[parts.length - 1]);
    }
  }
  return 0;
}
