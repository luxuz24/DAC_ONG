const acoesService = require('./acoes.service');
const { sendSuccess } = require('../../shared/response');

const listar = async (req, res, next) => {
  try {
    const acoes = await acoesService.listar();
    sendSuccess(res, { acoes });
  } catch (err) {
    next(err);
  }
};

const buscarPorId = async (req, res, next) => {
  try {
    const acao = await acoesService.buscarPorId(req.params.id);
    sendSuccess(res, { acao });
  } catch (err) {
    next(err);
  }
};

const criar = async (req, res, next) => {
  try {
    const acao = await acoesService.criar(req.body, req.usuario.id);
    sendSuccess(res, { acao }, 201);
  } catch (err) {
    next(err);
  }
};

const atualizar = async (req, res, next) => {
  try {
    const acao = await acoesService.atualizar(req.params.id, req.body, req.usuario.id);
    sendSuccess(res, { acao });
  } catch (err) {
    next(err);
  }
};

const excluir = async (req, res, next) => {
  try {
    await acoesService.excluir(req.params.id, req.usuario.id);
    sendSuccess(res, null, 204);
  } catch (err) {
    next(err);
  }
};

const listarVoluntarios = async (req, res, next) => {
  try {
    const voluntarios = await acoesService.listarVoluntarios(req.params.id, req.usuario.id);
    sendSuccess(res, { voluntarios });
  } catch (err) {
    next(err);
  }
};

const listarAtividades = async (req, res, next) => {
  try {
    const atividades = await acoesService.listarAtividades(req.usuario.id);
    sendSuccess(res, { atividades });
  } catch (err) {
    next(err);
  }
};

const toggleCurtida = async (req, res, next) => {
  try {
    const result = await acoesService.toggleCurtida(req.params.id, req.usuario.id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

const listarCurtidas = async (req, res, next) => {
  try {
    const curtidas = await acoesService.listarCurtidas(req.usuario.id);
    sendSuccess(res, { curtidas });
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir, listarVoluntarios, listarAtividades, toggleCurtida, listarCurtidas };
