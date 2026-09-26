"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json() as any;
        // Rediriger en fonction du rôle
        if (data.role === "prof") {
          router.push("/admin/paiements");
        } else {
          router.push("/admin");
        }
        router.refresh();
      } else {
        const data = await res.json() as any;
        setError(data.error || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display text-encre mb-2">Connexion Admin</h1>
          <p className="text-ardoise text-sm">Connectez-vous pour gérer la plateforme</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-encre mb-1">Identifiant</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-azur focus:ring-1 focus:ring-azur transition-colors"
              placeholder="Ex: gtsadmin1847"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-encre mb-1">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-azur focus:ring-1 focus:ring-azur transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-encre text-white py-2.5 rounded font-medium hover:bg-encre/90 transition-colors disabled:opacity-70"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
