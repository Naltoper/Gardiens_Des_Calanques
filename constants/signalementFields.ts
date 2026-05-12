
/**
 * Signalement Drop down menu content 
 */
export const SELECT_FIELDS = [
  { id: 'types', label: 'Type de harcèlement :', options: ["Cyber-harcèlement", "Physique", "Moral", "Exclusion", "Autre"], placeholder: "Sélectionner..." },
  { id: 'urgence', label: "Niveau d'urgence :", options: ["Faible", "Moyen", "Élevé"], placeholder: "Évaluer..." },
  { id: 'date', label: "Date :", options: ["Aujourd'hui", "Une semaine", "Un mois", "Plus d'un mois"], placeholder: "Quand ?" },
  { id: 'lieu', label: "Lieu des faits :", options: ["Classe", "Récré", "Web", "Trajet", "Autre"], placeholder: "Où ?" },
  { id: 'frequence', label: "Fréquence :", options: ["Une seule fois", "De temps en temps", "Tous les jours"], placeholder: "Souvent ?" },
  { id: 'nbVictimes', label: "Nombre de victimes :", options: ["Moi", "2-3", "Groupe"], placeholder: "Combien ?" },
];