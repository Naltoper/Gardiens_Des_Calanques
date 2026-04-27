/**
 * Formate une chaîne de date ISO en format lisible : "27/04/2026 à 10:30"
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(' ', ' à ');
};