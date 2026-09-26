"use client";

import { useState } from "react";

export default function ProfilPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessageType("error");
      setMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json() as any;
      if (res.ok) {
        setMessageType("success");
        setMessage("Mot de passe mis à jour avec succès.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessageType("error");
        setMessage(data.error || "Erreur lors du changement de mot de passe");
      }
    } catch (err) {
      setMessageType("error");
      setMessage("Erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-display text-encre mb-6">Mon Profil</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium text-encre mb-4">Changer de mot de passe</h2>
        
        {message && (
          <div className={`mb-4 p-3 text-sm rounded border ${
            messageType === "success" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-encre mb-1">Mot de passe actuel</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-azur"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-encre mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-azur"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-encre mb-1">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-azur"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-encre text-white py-2 rounded font-medium hover:bg-encre/90 disabled:opacity-70 mt-2"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
