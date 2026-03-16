import { useState, useRef, useEffect } from "react";
import { kvGet, kvPut, kvDelete, kvGetAll } from "../api/kvApi";

export default function KvTerminal({ leader, onOperation }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([
    { type: "dim", text: "Welcome to Distributed KV Store Terminal" },
    { type: "dim", text: "Type HELP for commands." }
  ]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const leaderUrl = leader?.baseUrl;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  function push(line) {
    setOutput((prev) => [...prev.slice(-80), line]);
  }

  async function exec(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0]?.toUpperCase();
    push({ type: "cmd", text: `$ ${raw}` });
    setHistory((h) => [raw, ...h.slice(0, 49)]);
    setHistoryIdx(-1);

    if (!leaderUrl && cmd !== "HELP" && cmd !== "CLEAR") {
      push({ type: "dim", text: "  ⟳ Connecting to cluster... wait 2s and retry" });
      return;
    }

    try {
      setLoading(true);
      switch (cmd) {
        case "GET": {
          if (!parts[1]) { push({ type: "error", text: "Usage: GET <key>" }); break; }
          const r = await kvGet(leaderUrl, parts[1]);
          push({ type: "success", text: `"${r.key}" = "${r.value}"` });
          onOperation?.();
          break;
        }
        case "PUT": {
          if (!parts[1] || !parts[2]) { push({ type: "error", text: "Usage: PUT <key> <value>" }); break; }
          const val = parts.slice(2).join(" ");
          await kvPut(leaderUrl, parts[1], val);
          push({ type: "success", text: "Successfully OK" });
          onOperation?.();
          break;
        }
        case "DELETE": {
          if (!parts[1]) { push({ type: "error", text: "Usage: DELETE <key>" }); break; }
          await kvDelete(leaderUrl, parts[1]);
          push({ type: "success", text: `Deleted "${parts[1]}"` });
          onOperation?.();
          break;
        }
        case "ALL": {
          const all = await kvGetAll(leaderUrl);
          const entries = Object.entries(all);
          if (!entries.length) { push({ type: "dim", text: "(empty)" }); }
          else { entries.forEach(([k, v]) => push({ type: "success", text: `"${k}" → "${v}"` })); }
          break;
        }
        case "CLEAR":
          setOutput([]);
          break;
        case "HELP":
          push({ type: "dim", text: "PUT <key> <value> | GET <key> | DELETE <key> | ALL | CLEAR" });
          break;
        default:
          push({ type: "error", text: `  ✗ Unknown command: "${cmd}" — type 'help'` });
      }
    } catch (err) {
      push({ type: "error", text: `Error: ${err.response?.data?.error || err.message}` });
    } finally {
      setLoading(false);
    }
  }

  function onKey(e) {
    if (e.key === "Enter" && input.trim() && !loading) { exec(input.trim()); setInput(""); }
    if (e.key === "ArrowUp") { e.preventDefault(); const i = Math.min(historyIdx + 1, history.length - 1); setHistoryIdx(i); setInput(history[i] || ""); }
    if (e.key === "ArrowDown") { e.preventDefault(); const i = Math.max(historyIdx - 1, -1); setHistoryIdx(i); setInput(i < 0 ? "" : history[i] || ""); }
  }

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      {/* Traffic lights */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
        <div className="terminal-dot" style={{ background: "#ff5f57" }} />
        <div className="terminal-dot" style={{ background: "#febc2e" }} />
        <div className="terminal-dot" style={{ background: "#28c840" }} />
      </div>

      {/* Output scrollable area */}
      <div className="mono" style={{ height: 260, overflowY: "auto", padding: "16px 20px", fontSize: 12, lineHeight: 1.8, color: "var(--green)" }}>
        {output.map((line, i) => (
          <p key={i} style={{
            whiteSpace: "pre-wrap",
            color: line.type === "error" ? "var(--red)" : line.type === "dim" ? "var(--text-dim)" : "var(--green)",
            margin: 0,
          }}>
            {line.text}
          </p>
        ))}
        {loading && <p style={{ color: "var(--green)" }} className="animate-pulse">Processing...</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderTop: "1px solid var(--border)", background: "rgba(10,14,26,0.5)" }}>
        <span className="mono" style={{ color: "var(--green)", fontSize: 13 }}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder={leaderUrl ? "PUT key value" : "Connecting to cluster..."}
          className="mono"
          style={{ flex: 1, background: "transparent", outline: "none", border: "none", color: "var(--green)", fontSize: 12, caretColor: "var(--green)" }}
          disabled={loading}
          autoFocus
        />
      </div>
    </div>
  );
}
