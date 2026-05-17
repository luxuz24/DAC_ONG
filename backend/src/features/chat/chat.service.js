const chatRepository = require('./chat.repository');

const salvarMensagem = async (mensagem, remetenteId, acaoId) => {
  return chatRepository.salvar(mensagem, remetenteId, acaoId);
};

const buscarHistorico = async (acaoId) => {
  return chatRepository.findHistorico(acaoId);
};

module.exports = { salvarMensagem, buscarHistorico };
