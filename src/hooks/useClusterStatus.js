import { useState, useEffect, useCallback } from "react";
import { NODES, POLL_INTERVAL_MS } from "../config";
import { fetchStatus } from "../api/kvApi";

export function useClusterStatus() {
  const [statuses, setStatuses] = useState(
    NODES.map((n) => ({ ...n, status: null, error: false, loading: true }))
  );
  const [leader, setLeader] = useState(null);

  const refresh = useCallback(async () => {
    const results = await Promise.allSettled(
      NODES.map((node) => fetchStatus(node))
    );

    const updated = NODES.map((node, i) => {
      const result = results[i];
      if (result.status === "fulfilled") {
        return { ...node, status: result.value, error: false, loading: false };
      }
      return { ...node, status: null, error: true, loading: false };
    });

    setStatuses(updated);

    const leaderNode = updated.find(
      (n) => n.status?.state === "LEADER"
    );
    setLeader(leaderNode || null);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  return { statuses, leader, refresh };
}
