const { query } = require('../../config/db');

const findById = async (id) => {
  const result = await query(
    'SELECT id, nome, email, tipo, criado_em FROM usuarios WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

const updateById = async (id, { nome, email }) => {
  const result = await query(
    `UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3
     RETURNING id, nome, email, tipo, criado_em`,
    [nome, email, id]
  );
  return result.rows[0] || null;
};

const getPerfilVoluntarioData = async (id) => {
  const userRes = await query('SELECT id, nome, email, criado_em FROM usuarios WHERE id = $1 AND tipo = $2', [id, 'voluntario']);
  const usuario = userRes.rows[0];
  if (!usuario) return null;

  const countInscritas = await query('SELECT COUNT(*) FROM participacoes WHERE usuario_id = $1', [id]);
  const countFinalizadas = await query(`
    SELECT COUNT(*) FROM participacoes p 
    JOIN acoes a ON a.id = p.acao_id 
    WHERE p.usuario_id = $1 AND a.status IN ('finalizada', 'concluida')
  `, [id]);

  const acoesRes = await query(`
    SELECT a.id, a.titulo, a.categoria, a.data, a.cor, a.status, p.inscrito_em 
    FROM participacoes p 
    JOIN acoes a ON a.id = p.acao_id 
    WHERE p.usuario_id = $1 
    ORDER BY a.data DESC
  `, [id]);

  return {
    ...usuario,
    estatisticas: {
      acoes_inscritas: parseInt(countInscritas.rows[0].count, 10),
      acoes_realizadas: parseInt(countFinalizadas.rows[0].count, 10),
    },
    acoes: acoesRes.rows
  };
};

const getVoluntarios = async () => {
  const result = await query(
    `SELECT id, nome, email FROM usuarios WHERE tipo = 'voluntario' ORDER BY nome ASC`
  );
  return result.rows;
};

module.exports = { findById, updateById, getPerfilVoluntarioData, getVoluntarios };
