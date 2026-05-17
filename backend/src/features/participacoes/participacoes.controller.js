const participacoesService = require('./participacoes.service');
const { sendSuccess } = require('../../shared/response');

const inscrever = async (req, res, next) => {
  try {
    const participacao = await participacoesService.inscrever(req.usuario.id, req.params.acaoId);
    sendSuccess(res, { participacao }, 201);
  } catch (err) {
    next(err);
  }
};

const cancelar = async (req, res, next) => {
  try {
    await participacoesService.cancelar(req.usuario.id, req.params.acaoId);
    sendSuccess(res, null, 204);
  } catch (err) {
    next(err);
  }
};

const minhasAcoes = async (req, res, next) => {
  try {
    const acoes = await participacoesService.minhasAcoes(req.usuario.id);
    sendSuccess(res, { acoes });
  } catch (err) {
    next(err);
  }
};

const minhasStats = async (req, res, next) => {
  try {
    const stats = await participacoesService.minhasStats(req.usuario.id);
    sendSuccess(res, { stats });
  } catch (err) {
    next(err);
  }
};

module.exports = { inscrever, cancelar, minhasAcoes, minhasStats };
