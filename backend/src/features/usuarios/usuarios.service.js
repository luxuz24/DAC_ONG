const usuariosRepository = require('./usuarios.repository');
const AppError = require('../../shared/AppError');

const getMe = async (id) => {
  const usuario = await usuariosRepository.findById(id);
  if (!usuario) throw new AppError('Usuário não encontrado.', 404);
  return usuario;
};

const updateMe = async (id, dados) => {
  const usuario = await usuariosRepository.updateById(id, dados);
  if (!usuario) throw new AppError('Usuário não encontrado.', 404);
  return usuario;
};

const getPerfilVoluntario = async (id) => {
  const perfil = await usuariosRepository.getPerfilVoluntarioData(id);
  if (!perfil) throw new AppError('Voluntário não encontrado.', 404);
  return perfil;
};

const listarVoluntarios = async () => {
  return usuariosRepository.getVoluntarios();
};

module.exports = { getMe, updateMe, getPerfilVoluntario, listarVoluntarios };
