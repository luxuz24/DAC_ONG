const acoesRepository = require('./acoes.repository');
const AppError = require('../../shared/AppError');

const listar = async () => acoesRepository.findAll();

const buscarPorId = async (id) => {
  const acao = await acoesRepository.findById(id);
  if (!acao) throw new AppError('Ação não encontrada.', 404);
  return acao;
};

const criar = async (dados, organizadorId) => {
  return acoesRepository.create({ ...dados, organizadorId });
};

const atualizar = async (id, dados, usuarioId) => {
  const acao = await acoesRepository.findById(id);
  if (!acao) throw new AppError('Ação não encontrada.', 404);
  if (acao.organizador_id !== usuarioId) {
    throw new AppError('Você não tem permissão para editar esta ação.', 403);
  }
  return acoesRepository.updateById(id, dados);
};

const excluir = async (id, usuarioId) => {
  const acao = await acoesRepository.findById(id);
  if (!acao) throw new AppError('Ação não encontrada.', 404);
  if (acao.organizador_id !== usuarioId) {
    throw new AppError('Você não tem permissão para excluir esta ação.', 403);
  }
  await acoesRepository.deleteById(id);
};

const listarVoluntarios = async (acaoId, usuarioId) => {
  const acao = await acoesRepository.findById(acaoId);
  if (!acao) throw new AppError('Ação não encontrada.', 404);
  if (acao.organizador_id !== usuarioId) {
    throw new AppError('Você não tem permissão para ver os voluntários desta ação.', 403);
  }
  return acoesRepository.findVoluntariosByAcaoId(acaoId);
};

const listarAtividades = async (organizadorId) => {
  return acoesRepository.getAtividadesRecentes(organizadorId);
};

const toggleCurtida = async (acaoId, voluntarioId) => {
  const acao = await acoesRepository.findById(acaoId);
  if (!acao) throw new AppError('Ação não encontrada.', 404);
  return acoesRepository.toggleCurtida(acaoId, voluntarioId);
};

const listarCurtidas = async (voluntarioId) => {
  return acoesRepository.findCurtidasByVoluntario(voluntarioId);
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir, listarVoluntarios, listarAtividades, toggleCurtida, listarCurtidas };
