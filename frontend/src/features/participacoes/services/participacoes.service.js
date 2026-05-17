import api from '../../../services/api';

export const inscrever = (acaoId) => api.post(`/participacoes/acoes/${acaoId}/inscrever`);
export const cancelar = (acaoId) => api.delete(`/participacoes/acoes/${acaoId}/cancelar`);
export const minhasAcoes = () => api.get('/participacoes/minhas');
export const minhasStats = () => api.get('/participacoes/minhas/stats');
