const participacoesRepository = require('./participacoes.repository');
const acoesRepository = require('../acoes/acoes.repository');
const AppError = require('../../shared/AppError');

const inscrever = async (usuarioId, acaoId) => {
  const acao = await acoesRepository.findById(acaoId);
  if (!acao) throw new AppError('Ação não encontrada.', 404);

  const jaInscrito = await participacoesRepository.exists(usuarioId, acaoId);
  if (jaInscrito) throw new AppError('Você já está inscrito nesta ação.', 409);

  return participacoesRepository.inscrever(usuarioId, acaoId);
};

const cancelar = async (usuarioId, acaoId) => {
  const resultado = await participacoesRepository.cancelar(usuarioId, acaoId);
  if (!resultado) throw new AppError('Inscrição não encontrada.', 404);
};

const minhasAcoes = async (usuarioId) => {
  return participacoesRepository.findByUsuario(usuarioId);
};

const minhasStats = async (usuarioId) => {
  return participacoesRepository.minhasStats(usuarioId);
};

module.exports = { inscrever, cancelar, minhasAcoes, minhasStats };
