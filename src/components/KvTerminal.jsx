import { useState, useRef, useEffect } from "react";
import { kvGet, kvPut, kvDelete, kvGetAll } from "../api/kvApi";

export default function KvTerminal({ leader, onOperation }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([
    { type: "system", text: "▸ Distributed KV Store  v1.0" },
    { type: "system", text: "▸ Raft consensus · Java 21 · 3-node cluster" },
    { type: "dim", text: "  Commands: PUT <key> <value>  GET <key>  DELETE <key>  ALL  CLEAR" },
    { type: "dim", text: "─────────────────────────────────────────────" },
  ]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const leaderUrl = leader?.baseUrl;

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  function addOutput(line) {
    setOutput((prev) => [...prev.slice(-99), line]);
  }

  async function handleCommand(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0]?.toUpperCase();

    addOutput({ type: "input", text: `$ ${raw}` });
    setHistory((h) => [raw, ...h.slice(0, 49)]);
    setHistoryIdx(-1);

    if (!leaderUrl && cmd !== "HELP" && cmd !== "CLEAR") {
      addOutput({ type: "error", text: "  ✗ No leader available — cluster may be electing" });
      return;
    }

    try {
      setLoading(true);
      switch (cmd) {
        case "GET": {
          if (!parts[1]) { addOutput({ type: "error", text: "  Usage: GET <key>" }); break; }
          const res = await kvGet(leaderUrl, parts[1]);
          addOutput({ type: "success", text: `  ✓ "${res.key}"` });
          addOutput({ type: "value", text: `    → "${res.value}"` });
          onOperation?.("GET");
          break;
        }
        case "PUT": {
          if (!parts[1] || !parts[2]) {
            addOutput({ type: "error", text: "  Usage: PUT <key> <value>" });
            break;
          }
          const value = parts.slice(2).join(" ");
          await kvPut(leaderUrl, parts[1], value);
          addOutput({ type: "success", text: `  ✓ SET "${parts[1]}" = "${value}"` });
          addOutput({ type: "dim", text: `    committed via Raft quorum → ${leader?.label}` });
          onOperation?.("PUT");
          break;
        }
        case "DELETE": {
          if (!parts[1]) { addOutput({ type: "error", text: "  Usage: DELETE <key>" }); break; }
          await kvDelete(leaderUrl, parts[1]);
          addOutput({ type: "warning", text: `  ✓ DELETED "${parts[1]}"` });
          onOperation?.("DELETE");
          break;
        }
        case "ALL": {
          const all = await kvGetAll(leaderUrl);
          const entries = Object.entries(all);
          if (entries.length === 0) {
            addOutput({ type: "dim", text: "  (store is empty)" });
          } else {
            addOutput({ type: "dim", text: `  ${entries.length} key(s):` });
            entries.forEach(([k, v]) =>
              addOutput({ type: "value", text: `    "${k}" → "${v}"` })
            );
          }
          break;
        }
        case "CLEAR":
          setOutput([{ type: "dim", text: "  cleared ·  type 'help' for commands" }]);
          break;
        case "HELP":
          [
            "  PUT <key> <value>   — write a key (goes through Raft leader)",
            "  GET <key>           — read a key",
            "  DELETE <key>        — remove a key",
            "  ALL                 — list all keys",
            "  CLEAR               — clear terminal",
          ].forEach((c) => addOutput({ type: "dim", text: c }));
          break;
        default:
          addOutput({ type: "error", text: `  ✗ Unknown command: ${cmd}` });
      }
    } catch (err) {
      const msg = err.response?.data || err.message;
      addOutput({ type: "error", text: `  ✗ ${JSON.stringify(msg)}` });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && input.trim() && !loading) {
      handleCommand(input.trim());
      setInput("");
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(idx);
      setInput(history[idx] || "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(idx);
      setInput(idx === -1 ? "" : history[idx] || "");
    }
  }

  const typeStyle = {
    system:  "text-emerald-400 font-semibold",
    input:   "text-slate-400",
    success: "text-emerald-400",
    value:   "text-sky-300",
    error:   "text-red-400",
    warning: "text-yellow-400",
    dim:     "text-slate-600",
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-mono text-slate-500 tracking-widest uppercase mb-1">KV Terminal</h2>
          <p className="text-sm font-semibold text-slate-300">
            {leaderUrl
              ? <span className="text-emerald-400">→ {leader.label} <span className="text-slate-600">(accepting writes)</span></span>
              : <span className="text-yellow-400">⚠ No leader elected</span>
            }
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl border border-slate-800 bg-[#0a0f1a] overflow-hidden"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Mac-style traffic lights */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-800/60 bg-slate-900/40">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          <span className="ml-3 text-xs text-slate-600 font-mono">kv-store — bash</span>
        </div>

        {/* Output area */}
        <div className="h-64 overflow-y-auto p-4 font-mono text-sm space-y-0.5 scrollbar-thin">
          {output.map((line, i) => (
            <p key={i} className={`leading-relaxed ${typeStyle[line.type] || "text-slate-300"}`}>
              {line.text}
            </p>
          ))}
          {loading && (
            <p className="text-emerald-500 animate-pulse font-mono text-sm">  processing…</p>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input row */}
        <div className="border-t border-slate-800/60 flex items-center px-4 py-3 bg-slate-900/20">
          <span className="text-emerald-400 mr-2 font-mono text-sm select-none">›</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="PUT name koushik"
            className="flex-1 bg-transparent outline-none font-mono text-sm
                       text-slate-100 placeholder-slate-700 caret-emerald-400"
            disabled={loading}
            autoFocus
          />
          {input && (
            <kbd className="text-[10px] text-slate-700 border border-slate-800 rounded px-1 py-0.5 font-mono">
              ↵ enter
            </kbd>
          )}
        </div>
      </div>
    </section>
  );
}
