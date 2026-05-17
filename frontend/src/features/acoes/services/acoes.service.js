import api from '../../../services/api';

export const listar = () => api.get('/acoes');
export const buscarPorId = (id) => api.get(`/acoes/${id}`);
export const criar = (dados) => api.post('/acoes', dados);
export const atualizar = (id, dados) => api.put(`/acoes/${id}`, dados);
export const excluir = (id) => api.delete(`/acoes/${id}`);
export const listarVoluntarios = (id) => api.get(`/acoes/${id}/voluntarios`);
export const toggleCurtida = (id) => api.post(`/acoes/${id}/curtir`);
export const minhasCurtidas = () => api.get('/acoes/curtidas/minhas');
