const usuariosService = require('./usuarios.service');
const { sendSuccess } = require('../../shared/response');

const getMe = async (req, res, next) => {
  try {
    const usuario = await usuariosService.getMe(req.usuario.id);
    sendSuccess(res, { usuario });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const usuario = await usuariosService.updateMe(req.usuario.id, req.body);
    sendSuccess(res, { usuario });
  } catch (err) {
    next(err);
  }
};

const getPerfilVoluntario = async (req, res, next) => {
  try {
    const perfil = await usuariosService.getPerfilVoluntario(req.params.id);
    sendSuccess(res, { perfil });
  } catch (err) {
    next(err);
  }
};

const listarVoluntarios = async (req, res, next) => {
  try {
    const voluntarios = await usuariosService.listarVoluntarios();
    sendSuccess(res, { voluntarios });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, updateMe, getPerfilVoluntario, listarVoluntarios };
