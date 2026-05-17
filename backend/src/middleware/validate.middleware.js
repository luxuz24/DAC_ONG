const AppError = require('../shared/AppError');

/**
 * Fábrica de middleware de validação de request body com schema Joi.
 * @param {import('joi').Schema} schema - Schema Joi para validar req.body
 * @returns {Function} Middleware Express
 *
 * @example
 * router.post('/', validateMiddleware(criarAcaoSchema), controller.criar);
 */
const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const mensagens = error.details.map((d) => d.message).join('; ');
      return next(new AppError(mensagens, 400));
    }

    req.body = value; // usa o valor com defaults do Joi
    next();
  };
};

module.exports = validateMiddleware;
