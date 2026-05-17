const authService = require('./auth.service');
const { sendSuccess } = require('../../shared/response');

const register = async (req, res, next) => {
  try {
    const usuario = await authService.register(req.body);
    sendSuccess(res, { usuario }, 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const resultado = await authService.login(req.body);
    sendSuccess(res, resultado);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
