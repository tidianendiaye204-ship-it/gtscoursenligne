"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!accessKey) {
      setStatus("error");
      setErrorMsg("Clé Web3Forms manquante. Contactez l'administrateur.");
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.get("nom"),
          email: formData.get("email"),
          message: formData.get("message"),
          subject: "Nouveau message depuis gtscoursenligne.sn",
        }),
      });

      const data = await res.json() as any;

      if (data.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Une erreur est survenue. Réessayez.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Impossible d'envoyer le message. Vérifiez votre connexion internet.");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2"
          htmlFor="nom"
        >
          Nom complet
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-body text-white placeholder:text-white/20 focus:border-azur focus:ring-1 focus:ring-azur transition-all outline-none"
          placeholder="Ex: Amadou Diop"
        />
      </div>
      <div>
        <label
          className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2"
          htmlFor="email"
        >
          Adresse Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-body text-white placeholder:text-white/20 focus:border-azur focus:ring-1 focus:ring-azur transition-all outline-none"
          placeholder="amadou@example.com"
        />
      </div>
      <div>
        <label
          className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2"
          htmlFor="message"
        >
          Votre Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-body text-white placeholder:text-white/20 focus:border-azur focus:ring-1 focus:ring-azur transition-all outline-none resize-none"
          placeholder="Comment pouvons-nous vous aider ?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-white text-encre font-body font-semibold px-6 py-4 rounded-xl hover:bg-azur hover:text-white transition-all duration-300 shadow-lg shadow-white/5 hover:shadow-azur/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-encre"
      >
        {status === "sending" ? (
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Envoi en cours…
          </span>
        ) : (
          "Envoyer le message"
        )}
      </button>

      {status === "success" && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4 animate-fade-in-up">
          <svg className="w-6 h-6 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-body text-green-300 text-sm">
            Message envoyé avec succès ! On vous répond très vite.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-fade-in-up">
          <svg className="w-6 h-6 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-body text-red-300 text-sm">{errorMsg}</p>
        </div>
      )}
    </form>
  );
}
