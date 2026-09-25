"use client";

import { useState, useEffect } from "react";

type Eleve = {
  id: string;
  nom: string;
  prenom: string;
  numero_whatsapp: string;
  niveau_id: string;
  niveau_nom: string;
  paiement_id: string | null;
  paiement_statut: 'payé' | 'impayé' | 'partiel' | null;
};

type Niveau = {
  id: string;
  nom: string;
};

export default function PaiementsPage() {
  const [mois, setMois] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterNiveau, setFilterNiveau] = useState("tous");
  const [filterStatut, setFilterStatut] = useState("tous");

  const [isAdding, setIsAdding] = useState(false);
  const [newEleve, setNewEleve] = useState({ nom: "", prenom: "", numero_whatsapp: "", niveau_id: "" });

  const [historique, setHistorique] = useState<any[]>([]);
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);

  useEffect(() => {
    fetchData();
  }, [mois]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/paiements?mois=${mois}`);
      const data = (await res.json()) as { eleves: Eleve[], niveaux: Niveau[] };
      setEleves(data.eleves || []);
      setNiveaux(data.niveaux || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const archiverEleve = async (eleve: Eleve) => {
    if (!confirm(`Voulez-vous vraiment désactiver l'élève ${eleve.prenom} ${eleve.nom} ? Il n'apparaîtra plus dans les listes.`)) return;

    // Optimistic UI
    setEleves(eleves.filter(e => e.id !== eleve.id));

    try {
      await fetch('/api/paiements', {
        method: 'POST',
        body: JSON.stringify({
          action: 'ARCHIVER_ELEVE',
          payload: { eleve_id: eleve.id }
        })
      });
    } catch (e) {
      alert("Erreur lors de l'archivage");
      fetchData();
    }
  };

  const voirHistorique = async (eleve: Eleve) => {
    setSelectedEleve(eleve);
    setHistorique([]);
    try {
      const res = await fetch(`/api/paiements?eleve_id=${eleve.id}`);
      const data = (await res.json()) as any;
      setHistorique(data.historique || []);
    } catch (e) {
      console.error(e);
    }
  };

  const togglePaiement = async (eleve: Eleve) => {
    const currentStatut = eleve.paiement_statut || 'impayé';
    const nextStatut = currentStatut === 'payé' ? 'impayé' : 'payé';

    // Optimistic UI update
    setEleves(eleves.map(e => e.id === eleve.id ? { ...e, paiement_statut: nextStatut } : e));

    try {
      await fetch('/api/paiements', {
        method: 'POST',
        body: JSON.stringify({
          action: 'TOGGLE_PAIEMENT',
          payload: { eleve_id: eleve.id, mois, statut: nextStatut }
        })
      });
    } catch (e) {
      // Revert on error
      fetchData();
    }
  };

  const handleAddEleve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEleve.nom || !newEleve.prenom || !newEleve.numero_whatsapp || !newEleve.niveau_id) return;

    try {
      await fetch('/api/paiements', {
        method: 'POST',
        body: JSON.stringify({
          action: 'ADD_ELEVE',
          payload: newEleve
        })
      });
      setIsAdding(false);
      setNewEleve({ nom: "", prenom: "", numero_whatsapp: "", niveau_id: "" });
      fetchData();
    } catch (e) {
      alert("Erreur lors de l'ajout");
    }
  };

  const filteredEleves = eleves.filter(e => {
    const passNiveau = filterNiveau === "tous" || e.niveau_id === filterNiveau;
    const statutActuel = e.paiement_statut || 'impayé';
    const passStatut = filterStatut === "tous" || statutActuel === filterStatut;
    return passNiveau && passStatut;
  });

  const formatterWhatsAppMessage = (eleve: Eleve) => {
    const numero = eleve.numero_whatsapp.replace(/[^0-9]/g, '');
    const moisTexte = new Date(`${mois}-01`).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const msg = `Bonjour ${eleve.prenom},\n\nC'est un petit rappel concernant la mensualité des cours GTS pour le mois de ${moisTexte}.\n\nMerci de bien vouloir régulariser dès que possible. Cordialement !`;
    return `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
  };

  const genererRecu = (eleve: Eleve) => {
    import("jspdf").then((module) => {
      const jsPDF = module.default;
      const doc = new jsPDF();
      const moisTexte = new Date(`${mois}-01`).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      
      // Couleurs GTS
      doc.setFillColor(6, 26, 61); // Encre #061A3D
      doc.rect(0, 0, 210, 45, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("GTS COURS EN LIGNE", 105, 22, { align: "center" });
      
      doc.setFontSize(12);
      doc.setTextColor(56, 189, 248); // Azur
      doc.text("Maths • PC • SVT", 105, 32, { align: "center" });

      // Titre Reçu
      doc.setTextColor(6, 26, 61);
      doc.setFontSize(20);
      doc.text("REÇU DE PAIEMENT", 105, 65, { align: "center" });

      // Ligne Solaire
      doc.setDrawColor(245, 183, 0); // Solaire
      doc.setLineWidth(1.5);
      doc.line(75, 70, 135, 70);

      // Informations
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Reçu N° : ${eleve.paiement_id || Date.now()}`, 20, 90);
      doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 140, 90);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Informations de l'élève :", 20, 110);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Prénom & Nom : ${eleve.prenom} ${eleve.nom}`, 30, 120);
      doc.text(`Niveau : ${eleve.niveau_nom}`, 30, 130);
      doc.text(`Téléphone : ${eleve.numero_whatsapp}`, 30, 140);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Détails du paiement :", 20, 160);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Mensualité : ${moisTexte.toUpperCase()}`, 30, 170);
      doc.text(`Montant : 1 500 FCFA`, 30, 180);
      
      // Tampon PAYÉ
      doc.setDrawColor(34, 197, 94); // Vert
      doc.setTextColor(34, 197, 94);
      doc.setLineWidth(1);
      doc.rect(140, 160, 50, 20);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("PAYÉ", 165, 174, { align: "center" });

      // Pied de page
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Document généré numériquement par GTS. Merci de votre confiance.", 105, 270, { align: "center" });
      doc.text("www.gtscoursenligne.com", 105, 278, { align: "center" });

      doc.save(`Recu_GTS_${eleve.prenom}_${eleve.nom}_${moisTexte}.pdf`);
    });
  };

  const elevesImpayes = filteredEleves.filter(e => (e.paiement_statut || 'impayé') !== 'payé');
  const elevesPayes = filteredEleves.filter(e => e.paiement_statut === 'payé');

  const copierNumerosImpayes = async () => {
    const numeros = elevesImpayes
      .map(e => e.numero_whatsapp)
      .filter(num => num && num.trim() !== '')
      .join(', ');
      
    if (numeros) {
      try {
        await navigator.clipboard.writeText(numeros);
        alert(`${elevesImpayes.length} numéro(s) copié(s) ! Tu peux les coller dans une Liste de Diffusion WhatsApp.`);
      } catch (err) {
        console.error('Erreur lors de la copie', err);
        alert('Erreur lors de la copie des numéros.');
      }
    } else {
      alert("Aucun numéro à copier.");
    }
  };

  return (
    <div className="min-h-screen bg-encre text-white p-4 md:p-8 font-body">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-solaire">Suivi Paiements</h1>
            <p className="text-white/60 text-sm">Gestion des mensualités GTS</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-azur hover:bg-azur/80 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-azur/20"
          >
            + Nouvel Élève
          </button>
        </header>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-center items-center shadow-xl">
            <span className="text-white/60 text-sm uppercase tracking-wider mb-2">Total Attendu</span>
            <span className="text-3xl font-display font-bold text-white">{filteredEleves.length * 1500} FCFA</span>
          </div>
          <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-2xl flex flex-col justify-center items-center shadow-xl">
            <span className="text-green-400/80 text-sm uppercase tracking-wider mb-2">Déjà Encaissé</span>
            <span className="text-3xl font-display font-bold text-green-400">{elevesPayes.length * 1500} FCFA</span>
          </div>
          <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-2xl flex flex-col justify-center items-center shadow-xl">
            <span className="text-red-400/80 text-sm uppercase tracking-wider mb-2">Reste à Recouvrer</span>
            <span className="text-3xl font-display font-bold text-red-400">{elevesImpayes.length * 1500} FCFA</span>
          </div>
        </div>

        {/* Filtres & Mois */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-6 flex flex-col md:flex-row gap-4 shadow-xl">
          <div className="flex-1">
            <label className="block text-xs text-white/50 mb-1 uppercase tracking-wider">Mois</label>
            <input 
              type="month" 
              value={mois}
              onChange={(e) => setMois(e.target.value)}
              className="w-full bg-encre border border-white/20 rounded-lg px-3 py-2 text-white focus:border-solaire outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-white/50 mb-1 uppercase tracking-wider">Niveau</label>
            <select 
              value={filterNiveau}
              onChange={(e) => setFilterNiveau(e.target.value)}
              className="w-full bg-encre border border-white/20 rounded-lg px-3 py-2 text-white focus:border-solaire outline-none"
            >
              <option value="tous">Tous les niveaux</option>
              {niveaux.map(n => <option key={n.id} value={n.id}>{n.nom}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-white/50 mb-1 uppercase tracking-wider">Statut</label>
            <select 
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="w-full bg-encre border border-white/20 rounded-lg px-3 py-2 text-white focus:border-solaire outline-none"
            >
              <option value="tous">Tous les statuts</option>
              <option value="impayé">Impayés</option>
              <option value="payé">Payés</option>
            </select>
          </div>
        </div>

        {/* Listes */}
        {loading ? (
          <div className="text-center py-10 text-white/50 animate-pulse">Chargement des données...</div>
        ) : (
          <div className="grid gap-10">
            {filteredEleves.length === 0 ? (
              <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/10 text-white/50">
                Aucun élève trouvé pour ces critères.
              </div>
            ) : (
              <>
                {/* SECTION IMPAYÉS */}
                {(filterStatut === 'tous' || filterStatut === 'impayé') && elevesImpayes.length > 0 && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-red-500/20 pb-2">
                      <h2 className="text-xl font-bold text-red-400">
                        ❌ À Relancer (Impayés) - {elevesImpayes.length} élève(s)
                      </h2>
                      <button 
                        onClick={copierNumerosImpayes}
                        className="mt-2 sm:mt-0 flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                        title="Copier les numéros pour une liste de diffusion"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copier les numéros
                      </button>
                    </div>
                    <div className="grid gap-4">
                      {elevesImpayes.map(e => (
                        <div key={e.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-red-900/10 border border-red-500/20 hover:border-red-500/50 transition-all shadow-lg group">
                          <div className="mb-4 sm:mb-0 cursor-pointer" onClick={() => voirHistorique(e)}>
                            <h3 className="font-bold text-lg group-hover:text-azur transition-colors">{e.prenom} {e.nom}</h3>
                            <p className="text-sm text-white/60">{e.niveau_nom} • {e.numero_whatsapp}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => archiverEleve(e)}
                              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                              title="Désactiver l'élève"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                            <button 
                              onClick={() => togglePaiement(e)}
                              className="px-4 py-2 rounded-xl text-sm font-bold transition-colors bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/40"
                            >
                              Marquer comme Payé
                            </button>
                            <a 
                              href={formatterWhatsAppMessage(e)}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-500 hover:bg-green-400 text-white transition-transform hover:scale-105 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                              title="Relancer sur WhatsApp"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION PAYÉS */}
                {(filterStatut === 'tous' || filterStatut === 'payé') && elevesPayes.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-green-400 mb-4 border-b border-green-500/20 pb-2">
                      ✅ En Règle (Payés) - {elevesPayes.length} élève(s)
                    </h2>
                    <div className="grid gap-4">
                      {elevesPayes.map(e => (
                        <div key={e.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-green-900/20 border border-green-500/30 hover:border-green-500/50 transition-all shadow-lg opacity-80 group">
                          <div className="mb-4 sm:mb-0 cursor-pointer" onClick={() => voirHistorique(e)}>
                            <h3 className="font-bold text-lg group-hover:text-azur transition-colors">{e.prenom} {e.nom}</h3>
                            <p className="text-sm text-white/60">{e.niveau_nom} • {e.numero_whatsapp}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => archiverEleve(e)}
                              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                              title="Désactiver l'élève"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                            <button 
                              onClick={() => togglePaiement(e)}
                              className="px-4 py-2 rounded-xl text-sm font-bold transition-colors bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/40"
                              title="Annuler le paiement"
                            >
                              Payé
                            </button>
                            <button 
                              onClick={() => genererRecu(e)}
                              className="flex items-center justify-center w-10 h-10 rounded-xl bg-azur hover:bg-azur/80 text-white transition-transform hover:scale-105 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                              title="Générer le reçu PDF"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Modal Ajout Élève */}
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-encre border border-white/20 p-6 rounded-2xl w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-display font-bold text-solaire mb-6">Ajouter un élève</h2>
              <form onSubmit={handleAddEleve} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">Prénom</label>
                  <input type="text" required value={newEleve.prenom} onChange={e => setNewEleve({...newEleve, prenom: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-azur outline-none text-white" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Nom</label>
                  <input type="text" required value={newEleve.nom} onChange={e => setNewEleve({...newEleve, nom: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-azur outline-none text-white" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Numéro WhatsApp (ex: +22177...)</label>
                  <input type="tel" required value={newEleve.numero_whatsapp} onChange={e => setNewEleve({...newEleve, numero_whatsapp: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-azur outline-none text-white" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Niveau</label>
                  <select required value={newEleve.niveau_id} onChange={e => setNewEleve({...newEleve, niveau_id: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-azur outline-none text-white">
                    <option value="" disabled>Sélectionner un niveau</option>
                    {niveaux.map(n => <option key={n.id} value={n.id}>{n.nom}</option>)}
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-xl py-3 font-bold transition-colors">Annuler</button>
                  <button type="submit" className="flex-1 bg-azur hover:bg-azur/80 text-white rounded-xl py-3 font-bold transition-colors">Ajouter</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Historique */}
        {selectedEleve && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-encre border border-white/20 p-6 rounded-2xl w-full max-w-md shadow-2xl max-h-[80vh] flex flex-col">
              <h2 className="text-2xl font-display font-bold text-solaire mb-2">Historique</h2>
              <p className="text-white/60 mb-6">{selectedEleve.prenom} {selectedEleve.nom}</p>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {historique.length === 0 ? (
                  <p className="text-white/40 text-center py-4">Aucun paiement enregistré.</p>
                ) : (
                  historique.map((h, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-bold capitalize">{new Date(`${h.mois}-01`).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                        <p className="text-xs text-white/50">{h.date_paiement ? new Date(h.date_paiement).toLocaleDateString('fr-FR') : '-'}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${h.statut === 'payé' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {h.statut}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="pt-6">
                <button type="button" onClick={() => setSelectedEleve(null)} className="w-full bg-white/5 hover:bg-white/10 text-white rounded-xl py-3 font-bold transition-colors">Fermer</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
