/**
 * Classe de erro padronizada da aplicação.
 * Permite que o errorMiddleware identifique erros operacionais
 * e retorne respostas JSON consistentes.
 */
class AppError extends Error {
  /**
   * @param {string} message - Mensagem de erro legível
   * @param {number} statusCode - Código HTTP (ex: 400, 404, 403)
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
