const { query } = require('../../config/db');

const salvar = async (mensagem, remetenteId, acaoId) => {
  const result = await query(
    `INSERT INTO chat_mensagens (mensagem, remetente_id, acao_id)
     VALUES ($1, $2, $3)
     RETURNING id, mensagem, remetente_id, acao_id, enviado_em`,
    [mensagem, remetenteId, acaoId]
  );
  return result.rows[0];
};

const findHistorico = async (acaoId, limite = 50) => {
  const result = await query(
    `SELECT cm.id, cm.mensagem, cm.enviado_em,
            u.id AS remetente_id, u.nome AS remetente_nome
     FROM chat_mensagens cm
     JOIN usuarios u ON u.id = cm.remetente_id
     WHERE cm.acao_id = $1
     ORDER BY cm.enviado_em ASC
     LIMIT $2`,
    [acaoId, limite]
  );
  return result.rows;
};

module.exports = { salvar, findHistorico };
