"use client";

import { useState, useEffect } from "react";
import { NIVEAUX, MATIERES, CATEGORIES, CONCOURS, type Serie } from "@/lib/data";

export default function AdminPage() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const res = await fetch("/api/series");
      const data = await res.json();
      if (Array.isArray(data)) setSeries(data);
    } catch (e) {
      console.error("Erreur de chargement des séries:", e);
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json() as any;
    if (!res.ok) throw new Error(data.error || "Erreur d'upload");
    return data.url;
  };

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const titre = formData.get("titre") as string;
    const niveau = formData.get("niveau") as string;
    const matiere = formData.get("matiere") as string;
    const categorie = formData.get("categorie") as string;
    const concours = formData.get("concours") as string;
    const resume = formData.get("resume") as string;
    
    const enonceFile = formData.get("enonce") as File | null;
    const corrigeFile = formData.get("corrige") as File | null;

    const slug = generateSlug(titre);

    try {
      let enonceUrl = null;
      if (enonceFile && enonceFile.size > 0) {
        enonceUrl = await uploadFile(enonceFile, `series/${niveau}/${matiere}/${slug}-enonce.pdf`);
      }

      let corrigeUrl = null;
      if (corrigeFile && corrigeFile.size > 0) {
        corrigeUrl = await uploadFile(corrigeFile, `series/${niveau}/${matiere}/${slug}-corrige.pdf`);
      }

      const res = await fetch("/api/series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          titre,
          niveau,
          matiere,
          categorie,
          concours: concours || null,
          resume,
          contenu: {
            type: "pdf",
            fichierUrl: enonceUrl,
          },
          corrigeExemple: {
            type: "pdf",
            fichierUrl: corrigeUrl,
          },
        }),
      });

      const result = await res.json() as any;
      if (!res.ok) throw new Error(result.error || "Erreur lors de l'insertion");

      setMessage("Série ajoutée avec succès !");
      form.reset();
      fetchSeries();
    } catch (error: any) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette série ?")) return;

    try {
      const res = await fetch(`/api/series?slug=${slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchSeries();
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl text-encre mb-2">Backoffice</h1>
      <p className="font-body text-ardoise mb-10">
        Ajoute une série et sa correction.
      </p>

      <form
        className="space-y-5 border border-encre/10 rounded-sm p-6 mb-12"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block font-body text-sm text-encre mb-1">Titre de la série</label>
          <input name="titre" className="w-full border border-encre/20 rounded-sm px-4 py-2 bg-white" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-sm text-encre mb-1">Niveau</label>
            <select name="niveau" className="w-full border border-encre/20 rounded-sm px-4 py-2 bg-white" required>
              {NIVEAUX.map((n) => (
                <option key={n.slug} value={n.slug}>{n.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-body text-sm text-encre mb-1">Matière</label>
            <select name="matiere" className="w-full border border-encre/20 rounded-sm px-4 py-2 bg-white" required>
              {MATIERES.map((m) => (
                <option key={m.slug} value={m.slug}>{m.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-sm text-encre mb-1">Catégorie</label>
            <select name="categorie" className="w-full border border-encre/20 rounded-sm px-4 py-2 bg-white" required>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-body text-sm text-encre mb-1">Concours (si applicable)</label>
            <select name="concours" className="w-full border border-encre/20 rounded-sm px-4 py-2 bg-white">
              <option value="">Aucun</option>
              {CONCOURS.map((c) => (
                <option key={c.slug} value={c.slug}>{c.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-body text-sm text-encre mb-1">
            Résumé (utilisé pour le SEO même si le contenu est en PDF)
          </label>
          <textarea name="resume" rows={2} className="w-full border border-encre/20 rounded-sm px-4 py-2 bg-white" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-sm text-encre mb-1">Énoncé (PDF)</label>
            <input name="enonce" type="file" accept="application/pdf" className="w-full text-sm" />
          </div>
          <div>
            <label className="block font-body text-sm text-encre mb-1">Corrigé de l'exercice 1 (offert)</label>
            <input name="corrige" type="file" accept="application/pdf" className="w-full text-sm" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-encre text-craie font-body font-semibold px-6 py-3 rounded-sm hover:bg-azur transition-colors disabled:opacity-50"
        >
          {loading ? "Envoi en cours..." : "Ajouter la série"}
        </button>
        {message && (
          <p className="font-body text-sm text-azur mt-2">
            {message}
          </p>
        )}
      </form>

      <h2 className="font-display text-xl text-encre mb-4">Séries existantes ({series.length})</h2>
      <ul className="space-y-3">
        {series.map((s) => (
          <li key={s.slug} className="flex justify-between items-center font-body text-sm text-ardoise border-b border-encre/10 pb-2">
            <span>
              <strong>{s.titre}</strong> — {s.niveau} / {s.matiere}
            </span>
            <button 
              onClick={() => handleDelete(s.slug)}
              className="text-red-500 hover:text-red-700 px-3 py-1 border border-red-200 rounded hover:bg-red-50"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
