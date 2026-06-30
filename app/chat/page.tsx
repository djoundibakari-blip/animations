"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ChatMessage } from "@/types";
import Sidebar from "@/components/Sidebar";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-5`}>
      {!isUser && (
        <div
          className="w-7 h-7 flex items-center justify-center mr-3 shrink-0 mt-0.5"
          style={{ border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.07)" }}
        >
          <span className="font-black text-[10px] tracking-[2px]" style={{ color: "#fff" }}>H</span>
        </div>
      )}
      <div className={`max-w-[70%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className="px-4 py-3 text-sm leading-relaxed"
          style={
            isUser
              ? { background: "#fff", color: "#08080e" }
              : { background: "#0e0e18", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.78)", borderLeft: "2px solid rgba(167,139,250,0.3)" }
          }
          dangerouslySetInnerHTML={{
            __html: msg.content
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\n/g, "<br/>"),
          }}
        />
        <span
          className="text-[9px] font-mono mt-1.5 px-0.5 uppercase tracking-[0.15em]"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setUser(d.user);
          setMessages([
            {
              role: "assistant",
              content: `Bonjour **${d.user.name}** ! 👋\n\nJe suis Herald, votre assistant événements culturels.\n\nJe peux vous aider à :\n• Trouver des événements dans votre ville\n• Affiner vos préférences\n• Comprendre comment configurer votre agenda\n\nQue puis-je faire pour vous ?`,
              timestamp: new Date().toISOString(),
            },
          ]);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages.slice(-10) }),
      });
      const data = await res.json();

      if (res.ok && data.message) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message, timestamp: new Date().toISOString() },
        ]);
      } else {
        setError(data.error || "Erreur lors de la réponse.");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (!user) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "#08080e" }}
      >
        <span
          className="animate-spin text-3xl"
          style={{ color: "rgba(167,139,250,0.6)" }}
        >
          ⟳
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#08080e", color: "#fff" }}>
      <Sidebar userName={user.name} userEmail={user.email} />

      <div className="flex-1 flex flex-col h-screen">
        {/* ── Header ── */}
        <div
          className="px-6 py-4 flex items-center gap-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0e0e18" }}
        >
          <div
            className="w-8 h-8 flex items-center justify-center shrink-0"
            style={{ border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.07)" }}
          >
            <span className="font-black text-[10px] tracking-[2px]">H</span>
          </div>
          <div>
            <p className="font-black text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.85)" }}>
              Assistant Herald
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.28)" }}>
                En ligne
              </span>
            </div>
          </div>
          <div className="ml-auto">
            <div
              className="h-[1px] w-12"
              style={{ background: "linear-gradient(90deg, #a78bfa, #60a5fa)" }}
            />
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto chat-scroll p-6" style={{ background: "#08080e" }}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {loading && (
            <div className="flex justify-start mb-5">
              <div
                className="w-7 h-7 flex items-center justify-center mr-3 shrink-0"
                style={{ border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.07)" }}
              >
                <span className="font-black text-[10px] tracking-[2px]">H</span>
              </div>
              <div
                className="px-4 py-3"
                style={{ background: "#0e0e18", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "2px solid rgba(167,139,250,0.3)" }}
              >
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ background: "rgba(167,139,250,0.6)", animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <p
              className="text-center text-[10px] font-mono uppercase tracking-[0.15em] mb-4"
              style={{ color: "#f87171" }}
            >
              ✗ {error}
            </p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Input ── */}
        <div
          className="p-4 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0e0e18" }}
        >
          <div className="flex items-end gap-3 max-w-3xl mx-auto">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez un message… (Entrée pour envoyer)"
              rows={1}
              disabled={loading}
              className="flex-1 resize-none py-3 px-4 text-sm leading-relaxed max-h-40 transition-all duration-200"
              style={{
                background: "#08080e",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.85)",
                outline: "none",
                minHeight: "44px",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(167,139,250,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="px-4 py-3 font-black text-sm transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed hover:opacity-90 shrink-0"
              style={{ background: "#fff", color: "#08080e" }}
              aria-label="Envoyer"
            >
              ↑
            </button>
          </div>
          <p
            className="text-[9px] font-mono uppercase tracking-[0.15em] text-center mt-2"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            Shift+Entrée pour un saut de ligne
          </p>
        </div>
      </div>
    </div>
  );
}
