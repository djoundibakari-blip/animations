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
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 bg-herald-600 rounded-full flex items-center justify-center text-white font-black text-sm mr-2 shrink-0 mt-0.5">
          H
        </div>
      )}
      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-herald-600 text-white rounded-br-sm"
              : "bg-white border border-slate-100 text-slate-800 rounded-bl-sm shadow-sm"
          }`}
          style={{ whiteSpace: "pre-wrap" }}
          dangerouslySetInnerHTML={{
            __html: msg.content
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\n/g, "<br/>"),
          }}
        />
        <span className="text-xs text-slate-400 mt-1 px-1">{formatTime(msg.timestamp)}</span>
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
        const botMsg: ChatMessage = {
          role: "assistant",
          content: data.message,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMsg]);
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin text-herald-600 text-3xl">⟳</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user.name} userEmail={user.email} />

      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-herald-600 rounded-full flex items-center justify-center text-white font-black">
            H
          </div>
          <div>
            <p className="font-bold text-slate-900">Assistant Herald</p>
            <p className="text-xs text-green-500">En ligne</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto chat-scroll p-6">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {loading && (
            <div className="flex justify-start mb-4">
              <div className="w-8 h-8 bg-herald-600 rounded-full flex items-center justify-center text-white font-black text-sm mr-2 shrink-0">
                H
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-sm text-red-500 mb-4">{error}</div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-slate-100 p-4">
          <div className="flex items-end gap-3 max-w-3xl mx-auto">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez un message… (Entrée pour envoyer)"
              rows={1}
              className="flex-1 resize-none input py-3 max-h-40"
              style={{ minHeight: "44px" }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="btn-primary px-4 py-3 shrink-0"
              aria-label="Envoyer"
            >
              ↑
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center mt-2">
            Shift+Entrée pour un saut de ligne
          </p>
        </div>
      </div>
    </div>
  );
}
