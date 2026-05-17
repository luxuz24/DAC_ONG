const { query } = require('../../config/db');

const inscrever = async (usuarioId, acaoId) => {
  const result = await query(
    `INSERT INTO participacoes (usuario_id, acao_id)
     VALUES ($1, $2)
     RETURNING id, usuario_id, acao_id, inscrito_em`,
    [usuarioId, acaoId]
  );
  return result.rows[0];
};

const cancelar = async (usuarioId, acaoId) => {
  const result = await query(
    'DELETE FROM participacoes WHERE usuario_id = $1 AND acao_id = $2 RETURNING id',
    [usuarioId, acaoId]
  );
  return result.rows[0] || null;
};

const findByUsuario = async (usuarioId) => {
  const result = await query(
    `SELECT a.id, a.titulo, a.descricao, a.data, a.local, p.inscrito_em,
            u.nome AS organizador_nome
     FROM participacoes p
     JOIN acoes a ON a.id = p.acao_id
     JOIN usuarios u ON u.id = a.organizador_id
     WHERE p.usuario_id = $1
     ORDER BY a.data ASC`,
    [usuarioId]
  );
  return result.rows;
};

const exists = async (usuarioId, acaoId) => {
  const result = await query(
    'SELECT id FROM participacoes WHERE usuario_id = $1 AND acao_id = $2',
    [usuarioId, acaoId]
  );
  return result.rows.length > 0;
};

const minhasStats = async (usuarioId) => {
  const result = await query(
    `SELECT
       COUNT(p.id) as acoes_count,
       COUNT(p.id) * 4 as horas_count,
       COUNT(p.id) * 100 as impactados_count
     FROM participacoes p
     WHERE p.usuario_id = $1`,
    [usuarioId]
  );
  return result.rows[0];
};

module.exports = { inscrever, cancelar, findByUsuario, exists, minhasStats };
