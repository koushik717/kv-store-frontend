import { useState } from "react";
import { kvGet, kvPut, kvDelete, kvGetAll } from "../api/kvApi";

export default function KvTerminal({ leader, onOperation }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([
    { type: "info", text: "Distributed KV Store — type 'help' for commands" },
  ]);
  const [loading, setLoading] = useState(false);

  const leaderUrl = leader?.baseUrl;

  function addOutput(line) {
    setOutput((prev) => [...prev.slice(-49), line]); // keep last 50 lines
  }

  async function handleCommand(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0]?.toUpperCase();

    addOutput({ type: "input", text: `$ ${raw}` });

    if (!leaderUrl && cmd !== "HELP" && cmd !== "CLEAR") {
      addOutput({ type: "error", text: "No leader available. Cluster may be electing." });
      return;
    }

    try {
      setLoading(true);
      switch (cmd) {
        case "GET": {
          if (!parts[1]) { addOutput({ type: "error", text: "Usage: GET <key>" }); break; }
          const res = await kvGet(leaderUrl, parts[1]);
          addOutput({ type: "success", text: `"${res.key}" → "${res.value}"` });
          onOperation("GET");
          break;
        }
        case "PUT": {
          if (!parts[1] || !parts[2]) {
            addOutput({ type: "error", text: "Usage: PUT <key> <value>" });
            break;
          }
          const value = parts.slice(2).join(" ");
          await kvPut(leaderUrl, parts[1], value);
          addOutput({ type: "success", text: `✓ SET "${parts[1]}" = "${value}"` });
          onOperation("PUT");
          break;
        }
        case "DELETE": {
          if (!parts[1]) { addOutput({ type: "error", text: "Usage: DELETE <key>" }); break; }
          await kvDelete(leaderUrl, parts[1]);
          addOutput({ type: "success", text: `✓ DELETED "${parts[1]}"` });
          onOperation("DELETE");
          break;
        }
        case "ALL": {
          const all = await kvGetAll(leaderUrl);
          const entries = Object.entries(all);
          if (entries.length === 0) {
            addOutput({ type: "info", text: "(empty store)" });
          } else {
            entries.forEach(([k, v]) =>
              addOutput({ type: "success", text: `  "${k}" → "${v}"` })
            );
          }
          break;
        }
        case "CLEAR":
          setOutput([]);
          break;
        case "HELP":
          ["GET <key>", "PUT <key> <value>", "DELETE <key>", "ALL", "CLEAR"].forEach(
            (c) => addOutput({ type: "info", text: `  ${c}` })
          );
          break;
        default:
          addOutput({ type: "error", text: `Unknown command: ${cmd}. Type 'help'.` });
      }
    } catch (err) {
      const msg = err.response?.data || err.message;
      addOutput({ type: "error", text: `Error: ${JSON.stringify(msg)}` });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && input.trim()) {
      handleCommand(input.trim());
      setInput("");
    }
  }

  const typeStyle = {
    input:   "text-slate-400",
    success: "text-green-400",
    error:   "text-red-400",
    info:    "text-blue-400",
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-100">KV Terminal</h2>
        <span className="text-xs text-slate-500">
          {leaderUrl
            ? `→ ${leader.label} (LEADER)`
            : "⚠ No leader"}
        </span>
      </div>

      <div className="border border-slate-700 rounded-xl bg-slate-900 overflow-hidden">
        <div className="h-64 overflow-y-auto p-4 font-mono text-sm space-y-1">
          {output.map((line, i) => (
            <p key={i} className={typeStyle[line.type] || "text-slate-300"}>
              {line.text}
            </p>
          ))}
          {loading && (
            <p className="text-yellow-400 animate-pulse">processing...</p>
          )}
        </div>

        <div className="border-t border-slate-700 flex items-center px-4 py-3">
          <span className="text-green-400 mr-2 font-mono text-sm">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="PUT foo bar | GET foo | DELETE foo | ALL"
            className="flex-1 bg-transparent outline-none font-mono text-sm text-slate-100 placeholder-slate-600"
            disabled={loading}
            autoFocus
          />
        </div>
      </div>
    </section>
  );
}
