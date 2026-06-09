"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ role: string; text: string }[]>([
    {
      role: "model",
      text: "Greetings! I am Nexovo Cafe System AI. Ask about restocking, combos, GST reports, or sales forecasts."
    }
  ]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setHistory((p) => [...p, { role: "user", text }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      let reply =
        "Based on platform metrics, restock Wagyu Beef and Truffle Oil before the weekend rush. Expect +24% burger demand.";
      if (text.toLowerCase().includes("combo") || text.toLowerCase().includes("recommend")) {
        reply =
          "⭐ Recommended: Truffle Mushroom Pizza + Kyoto Cold Brew — 78% gross margin fusion pair.";
      }
      setHistory((p) => [...p, { role: "model", text: reply }]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-500 text-white shadow-2xl transition-all hover:scale-110"
      >
        <Sparkles className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 animate-pulse rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-black uppercase text-white">
          AI
        </span>
      </button>
      {open && (
        <div className="absolute bottom-16 left-0 flex w-80 flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl md:w-96">
          <div className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-purple-900 to-indigo-900 p-4">
            <h4 className="flex items-center gap-1.5 text-sm font-extrabold text-slate-100">
              <Sparkles className="h-4 w-4" /> Nexovo AI Assistant
            </h4>
            <button type="button" onClick={() => setOpen(false)} className="font-bold text-slate-300">
              ✕
            </button>
          </div>
          <div className="h-72 space-y-3 overflow-y-auto bg-slate-950 p-4 text-xs">
            {history.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-2.5 leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-tr-none bg-gradient-to-r from-purple-600 to-indigo-600 text-slate-100"
                      : "rounded-tl-none border border-slate-800 bg-slate-900 text-slate-300"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <p className="animate-pulse text-[10px] text-slate-400">Analyzing metrics…</p>}
          </div>
          <div className="flex gap-2 border-t border-slate-800 bg-slate-900 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask about stocks, combos…"
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-purple-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => send(input)}
              className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
