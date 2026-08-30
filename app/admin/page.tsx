"use client";

import { useState, useEffect, useRef } from "react";
import { NIVEAUX, MATIERES, CATEGORIES, CONCOURS, type Serie } from "@/lib/data";

export default function AdminPage() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterNiveau, setFilterNiveau] = useState("");
  const [filterMatiere, setFilterMatiere] = useState("");

  // Edit mode state
  const [editingSerie, setEditingSerie] = useState<Serie | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const startEditing = (serie: Serie) => {
    setEditingSerie(serie);
    setMessage("");
    // Scroll to the form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const cancelEditing = () => {
    setEditingSerie(null);
    setMessage("");
    formRef.current?.reset();
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

    const slug = generateSlug(titre);

    try {
      if (editingSerie) {
        // ---- UPDATE mode ----
        const res = await fetch("/api/series", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originalSlug: editingSerie.slug,
            slug,
            titre,
            niveau,
            matiere,
            categorie,
            concours: concours || null,
            resume,
          }),
        });

        const result = await res.json() as any;
        if (!res.ok) throw new Error(result.error || "Erreur lors de la mise à jour");

        showMessage("✓ Série mise à jour avec succès !", "success");
        setEditingSerie(null);
        form.reset();
        fetchSeries();
      } else {
        // ---- CREATE mode ----
        const enonceFile = formData.get("enonce") as File | null;
        const corrigeFile = formData.get("corrige") as File | null;

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

        showMessage("✓ Série ajoutée avec succès !", "success");
        form.reset();
        fetchSeries();
      }
    } catch (error: any) {
      showMessage(`Erreur: ${error.message}`, "error");
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
        // If we were editing this serie, cancel the edit
        if (editingSerie?.slug === slug) {
          cancelEditing();
        }
        fetchSeries();
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isEditing = editingSerie !== null;

  // Derived filtered series
  const filteredSeries = series.filter((s) => {
    const matchesSearch = s.titre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNiveau = filterNiveau ? s.niveau === filterNiveau : true;
    const matchesMatiere = filterMatiere ? s.matiere === filterMatiere : true;
    return matchesSearch && matchesNiveau && matchesMatiere;
  });

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl text-encre mb-2">Backoffice</h1>
      <p className="font-body text-ardoise mb-10">
        Ajoute ou modifie une série et sa correction.
      </p>

      {/* Edit mode banner */}
      {isEditing && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-azur/10 border border-azur/30 rounded-lg">
          <svg className="w-5 h-5 text-azur flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span className="font-body text-sm text-encre flex-1">
            Modification de <strong>{editingSerie.titre}</strong>
          </span>
          <button
            type="button"
            onClick={cancelEditing}
            className="text-xs font-body font-semibold text-ardoise hover:text-encre px-3 py-1.5 border border-encre/20 rounded hover:bg-encre/5 transition-colors"
          >
            Annuler
          </button>
        </div>
      )}

      <form
        ref={formRef}
        className={`space-y-5 border rounded-sm p-6 mb-12 transition-colors ${isEditing ? 'border-azur/30 bg-azur/[0.02]' : 'border-encre/10'}`}
        onSubmit={handleSubmit}
        key={editingSerie?.slug ?? "__new__"}
      >
        <div>
          <label className="block font-body text-sm text-encre mb-1">Titre de la série</label>
          <input
            name="titre"
            defaultValue={editingSerie?.titre ?? ""}
            className="w-full border border-encre/20 rounded-sm px-4 py-2 bg-white"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-sm text-encre mb-1">Niveau</label>
            <select
              name="niveau"
              defaultValue={editingSerie?.niveau ?? NIVEAUX[0].slug}
              className="w-full border border-encre/20 rounded-sm px-4 py-2 bg-white"
              required
            >
              {NIVEAUX.map((n) => (
                <option key={n.slug} value={n.slug}>{n.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-body text-sm text-encre mb-1">Matière</label>
            <select
              name="matiere"
              defaultValue={editingSerie?.matiere ?? MATIERES[0].slug}
              className="w-full border border-encre/20 rounded-sm px-4 py-2 bg-white"
              required
            >
              {MATIERES.map((m) => (
                <option key={m.slug} value={m.slug}>{m.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-sm text-encre mb-1">Catégorie</label>
            <select
              name="categorie"
              defaultValue={editingSerie?.categorie ?? CATEGORIES[0].slug}
              className="w-full border border-encre/20 rounded-sm px-4 py-2 bg-white"
              required
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-body text-sm text-encre mb-1">Concours (si applicable)</label>
            <select
              name="concours"
              defaultValue={editingSerie?.concours ?? ""}
              className="w-full border border-encre/20 rounded-sm px-4 py-2 bg-white"
            >
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
          <textarea
            name="resume"
            rows={2}
            defaultValue={editingSerie?.resume ?? ""}
            className="w-full border border-encre/20 rounded-sm px-4 py-2 bg-white"
            required
          />
        </div>

        {/* File upload fields — only shown in create mode */}
        {!isEditing && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-sm text-encre mb-1">Énoncé (PDF)</label>
              <input name="enonce" type="file" accept="application/pdf" className="w-full text-sm" />
            </div>
            <div>
              <label className="block font-body text-sm text-encre mb-1">Corrigé de l&apos;exercice 1 (offert)</label>
              <input name="corrige" type="file" accept="application/pdf" className="w-full text-sm" />
            </div>
          </div>
        )}

        {isEditing && (
          <p className="font-body text-xs text-ardoise/70 italic">
            Les fichiers PDF ne sont pas modifiables ici. Pour changer un PDF, supprimez la série et recréez-la.
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`font-body font-semibold px-6 py-3 rounded-sm transition-colors disabled:opacity-50 ${
              isEditing
                ? 'bg-azur text-white hover:bg-azur/90'
                : 'bg-encre text-craie hover:bg-azur'
            }`}
          >
            {loading
              ? "Envoi en cours..."
              : isEditing
                ? "Enregistrer les modifications"
                : "Ajouter la série"
            }
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={cancelEditing}
              disabled={loading}
              className="font-body font-semibold px-6 py-3 rounded-sm border border-encre/20 text-ardoise hover:text-encre hover:bg-encre/5 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
          )}
        </div>

        {message && (
          <p className={`font-body text-sm mt-2 ${messageType === "success" ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </form>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4 mt-12">
        <h2 className="font-display text-xl text-encre">Séries existantes ({filteredSeries.length})</h2>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Rechercher par titre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 md:w-48 border border-encre/20 rounded-sm px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-azur"
          />
          <select
            value={filterNiveau}
            onChange={(e) => setFilterNiveau(e.target.value)}
            className="border border-encre/20 rounded-sm px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-azur"
          >
            <option value="">Tous les niveaux</option>
            {NIVEAUX.map((n) => (
              <option key={n.slug} value={n.slug}>{n.nom}</option>
            ))}
          </select>
          <select
            value={filterMatiere}
            onChange={(e) => setFilterMatiere(e.target.value)}
            className="border border-encre/20 rounded-sm px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-azur"
          >
            <option value="">Toutes les matières</option>
            {MATIERES.map((m) => (
              <option key={m.slug} value={m.slug}>{m.nom}</option>
            ))}
          </select>
        </div>
      </div>

      <ul className="space-y-3">
        {filteredSeries.length === 0 ? (
          <p className="font-body text-sm text-ardoise py-4 text-center border border-dashed border-encre/10 rounded">
            Aucune série ne correspond à ces critères.
          </p>
        ) : (
          filteredSeries.map((s) => (
            <li
              key={s.slug}
              className={`flex justify-between items-center font-body text-sm border-b pb-2 transition-colors ${
                editingSerie?.slug === s.slug
                  ? 'text-encre bg-azur/5 -mx-3 px-3 py-2 rounded border-azur/20'
                  : 'text-ardoise border-encre/10'
              }`}
            >
              <span>
                <strong>{s.titre}</strong> — {s.niveau} / {s.matiere}
                <span className="ml-2 inline-flex gap-1">
                  {s.contenu?.fichierUrl ? (
                    <span className="bg-encre/5 text-encre text-[10px] uppercase font-bold px-1.5 py-0.5 rounded" title="Énoncé PDF">📄</span>
                  ) : null}
                  {s.corrigeExemple?.fichierUrl ? (
                    <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded" title="Corrigé PDF">✅</span>
                  ) : null}
                </span>
              </span>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => startEditing(s)}
                  className={`px-3 py-1 border rounded transition-colors ${
                    editingSerie?.slug === s.slug
                      ? 'text-white bg-azur border-azur'
                      : 'text-azur hover:text-white hover:bg-azur border-azur/30 hover:border-azur'
                  }`}
                >
                  Modifier
                </button>
                <button 
                  onClick={() => handleDelete(s.slug)}
                  className="text-red-500 hover:text-red-700 px-3 py-1 border border-red-200 rounded hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
