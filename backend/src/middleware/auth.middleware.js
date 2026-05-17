const jwt = require('jsonwebtoken');
const AppError = require('../shared/AppError');
const { jwtSecret } = require('../config/env');

/**
 * Middleware de autenticação via JWT.
 * Extrai o token do header Authorization e popula req.usuario.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token de autenticação não fornecido.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.usuario = decoded; // { id, nome, tipo }
    next();
  } catch (err) {
    return next(new AppError('Token inválido ou expirado.', 401));
  }
};

module.exports = authMiddleware;
