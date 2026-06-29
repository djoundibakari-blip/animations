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
        className="btn-primary flex items-center gap-2"
      >
        {status === "loading" ? (
          <>
            <span className="animate-spin">⟳</span> Envoi…
          </>
        ) : (
          <>
            <span>📧</span> Envoyer mon agenda
          </>
        )}
      </button>
      {status === "success" && (
        <p className="text-sm text-green-600 mt-1.5">✓ {message}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 mt-1.5">✗ {message}</p>
      )}
    </div>
  );
}
