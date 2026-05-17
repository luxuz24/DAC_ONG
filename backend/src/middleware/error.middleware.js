const AppError = require('../shared/AppError');

/**
 * Middleware global de tratamento de erros.
 * Deve ser registrado APÓS todas as rotas no app.js.
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  // Erros operacionais conhecidos (AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Erros de violação de constraint única do PostgreSQL
  if (err.code === '23505') {
    return res.status(409).json({
      status: 'error',
      message: 'Registro duplicado. Verifique os dados informados.',
    });
  }

  // Erros desconhecidos — não expõe detalhes internos
  console.error('Erro não tratado:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Ocorreu um erro interno. Tente novamente mais tarde.',
  });
};

module.exports = errorMiddleware;
