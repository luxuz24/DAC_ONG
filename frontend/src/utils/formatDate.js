/**
 * Formata uma data ISO para exibição em pt-BR.
 * @param {string} dateString - Data ISO (ex: "2026-06-01")
 * @returns {string} Data formatada (ex: "01 de junho de 2026")
 */
export const formatarData = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

/**
 * Formata data e hora para exibição no chat.
 * @param {string} dateString
 * @returns {string} Ex: "14:35"
 */
export const formatarHora = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
