"use client";

import { useState } from "react";

interface AgendaButtonProps {
  disabled?: boolean;
}

export default function AgendaButton({ disabled }: AgendaButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSend() {
    setStatus("loading");
    try {
      const res = await fetch("/api/agenda/send", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(
          data.sent
            ? `Agenda envoyé (${data.eventCount} événements) !`
            : data.message || "Agenda en file d'attente."
        );
      } else {
        setStatus("error");
        setMessage(data.error || "Erreur lors de l'envoi.");
      }
    } catch {
      setStatus("error");
      setMessage("Erreur réseau.");
    }
    setTimeout(() => setStatus("idle"), 5000);
  }

  return (
    <div>
      <button
        onClick={handleSend}
        disabled={disabled || status === "loading"}
        className="inline-flex items-center gap-2 font-black text-[11px] uppercase tracking-[0.2em] px-5 py-2.5 transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed hover:opacity-90"
        style={{ background: "#fff", color: "#08080e" }}
      >
        {status === "loading" ? (
          <>
            <span className="animate-spin inline-block">⟳</span> Envoi…
          </>
        ) : (
          <>
            <span>📧</span> Envoyer mon agenda
          </>
        )}
      </button>
      {status === "success" && (
        <p
          className="text-[10px] font-mono mt-1.5 uppercase tracking-[0.1em]"
          style={{ color: "#34d399" }}
        >
          ✓ {message}
        </p>
      )}
      {status === "error" && (
        <p
          className="text-[10px] font-mono mt-1.5 uppercase tracking-[0.1em]"
          style={{ color: "#f87171" }}
        >
          ✗ {message}
        </p>
      )}
    </div>
  );
}
