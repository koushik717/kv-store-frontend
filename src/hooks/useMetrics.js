import { useState, useEffect } from "react";
import { NODES, METRICS_INTERVAL_MS } from "../config";
import { fetchMetrics, parseMetric } from "../api/kvApi";

export function useMetrics() {
  const [history, setHistory] = useState([]); // array of {time, reads, writes}

  useEffect(() => {
    const poll = async () => {
      for (const node of NODES) {
        try {
          const text = await fetchMetrics(node);
          const reads = parseMetric(text, 'kv_operations_total{type="read"}');
          const writes = parseMetric(text, 'kv_operations_total{type="write"}');

          setHistory((prev) => {
            const next = [
              ...prev.slice(-29), // keep last 30 data points
              {
                time: new Date().toLocaleTimeString(),
                reads: reads || 0,
                writes: writes || 0,
              },
            ];
            return next;
          });
          break; // got data, stop trying nodes
        } catch (e) {
          // try next node
        }
      }
    };

    poll();
    const interval = setInterval(poll, METRICS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return history;
}
