const AppError = require('../shared/AppError');

/**
 * Fábrica de middleware de controle de acesso por role.
 * @param {...string} roles - Roles permitidas (ex: 'organizador', 'voluntario')
 * @returns {Function} Middleware Express
 *
 * @example
 * router.post('/', authMiddleware, roleMiddleware('organizador'), controller.criar);
 */
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return next(new AppError('Usuário não autenticado.', 401));
    }

    if (!roles.includes(req.usuario.tipo)) {
      return next(
        new AppError(
          `Acesso negado. Apenas [${roles.join(', ')}] podem realizar esta ação.`,
          403
        )
      );
    }

    next();
  };
};

module.exports = roleMiddleware;
