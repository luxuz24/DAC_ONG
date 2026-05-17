import api from '../../../services/api';

export const register = (dados) => api.post('/auth/register', dados);
export const login = (dados) => api.post('/auth/login', dados);
