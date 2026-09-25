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

  useEffect(() => {
    fetchData();
  }, [mois]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/paiements?mois=${mois}`);
      const data = await res.json();
      setEleves(data.eleves || []);
      setNiveaux(data.niveaux || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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

        {/* Liste */}
        {loading ? (
          <div className="text-center py-10 text-white/50 animate-pulse">Chargement des données...</div>
        ) : (
          <div className="grid gap-4">
            {filteredEleves.length === 0 ? (
              <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/10 text-white/50">
                Aucun élève trouvé pour ces critères.
              </div>
            ) : (
              filteredEleves.map(e => {
                const statut = e.paiement_statut || 'impayé';
                const isPaye = statut === 'payé';

                return (
                  <div key={e.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${isPaye ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/10 border-red-500/20'} hover:border-white/20 shadow-lg`}>
                    <div className="mb-4 sm:mb-0">
                      <h3 className="font-bold text-lg">{e.prenom} {e.nom}</h3>
                      <p className="text-sm text-white/60">{e.niveau_nom} • {e.numero_whatsapp}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => togglePaiement(e)}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-bold transition-colors border ${isPaye ? 'bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30'}`}
                      >
                        {isPaye ? '✅ Payé' : '❌ Impayé'}
                      </button>

                      {!isPaye && (
                        <a 
                          href={formatterWhatsAppMessage(e)}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-500 hover:bg-green-400 text-white transition-transform hover:scale-105 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                          title="Relancer sur WhatsApp"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
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

      </div>
    </div>
  );
}
