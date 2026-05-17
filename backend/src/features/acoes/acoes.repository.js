const { query } = require('../../config/db');

const findAll = async () => {
  const result = await query(
    `SELECT a.id, a.titulo, a.descricao, a.data, a.local, a.criado_em,
            a.vagas, a.categoria, a.status, a.cor,
            u.id AS organizador_id, u.nome AS organizador_nome,
            (SELECT COUNT(*) FROM participacoes p WHERE p.acao_id = a.id) as inscritos
     FROM acoes a
     JOIN usuarios u ON u.id = a.organizador_id
     ORDER BY a.data ASC`
  );
  return result.rows;
};

const findById = async (id) => {
  const result = await query(
    `SELECT a.id, a.titulo, a.descricao, a.data, a.local, a.criado_em,
            a.vagas, a.categoria, a.status, a.cor,
            u.id AS organizador_id, u.nome AS organizador_nome,
            (SELECT COUNT(*) FROM participacoes p WHERE p.acao_id = a.id) as inscritos
     FROM acoes a
     JOIN usuarios u ON u.id = a.organizador_id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

const create = async ({ titulo, descricao, data, local, organizadorId, vagas, categoria, cor }) => {
  const result = await query(
    `INSERT INTO acoes (titulo, descricao, data, local, organizador_id, vagas, categoria, cor)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, 20), COALESCE($7, 'Geral'), COALESCE($8, '#15803D'))
     RETURNING id, titulo, descricao, data, local, organizador_id, vagas, categoria, status, cor, criado_em`,
    [titulo, descricao, data, local, organizadorId, vagas, categoria, cor]
  );
  return result.rows[0];
};

const updateById = async (id, { titulo, descricao, data, local, vagas, categoria, status, cor }) => {
  const result = await query(
    `UPDATE acoes SET titulo = $1, descricao = $2, data = $3, local = $4,
                      vagas = COALESCE($5, vagas), categoria = COALESCE($6, categoria),
                      status = COALESCE($7, status), cor = COALESCE($8, cor)
     WHERE id = $9
     RETURNING id, titulo, descricao, data, local, organizador_id, vagas, categoria, status, cor, criado_em`,
    [titulo, descricao, data, local, vagas, categoria, status, cor, id]
  );
  return result.rows[0] || null;
};

const deleteById = async (id) => {
  await query('DELETE FROM acoes WHERE id = $1', [id]);
};

const findVoluntariosByAcaoId = async (acaoId) => {
  const result = await query(
    `SELECT u.id, u.nome, u.email, p.inscrito_em
     FROM participacoes p
     JOIN usuarios u ON u.id = p.usuario_id
     WHERE p.acao_id = $1
     ORDER BY p.inscrito_em ASC`,
    [acaoId]
  );
  return result.rows;
};

const getAtividadesRecentes = async (organizadorId) => {
  const result = await query(
    `
      SELECT 
        'nova_acao' AS tipo, 
        titulo, 
        NULL AS voluntario_nome, 
        criado_em AS data,
        cor
      FROM acoes 
      WHERE organizador_id = $1

      UNION ALL

      SELECT 
        'inscricao' AS tipo, 
        a.titulo, 
        u.nome AS voluntario_nome, 
        p.inscrito_em AS data,
        a.cor
      FROM participacoes p
      JOIN acoes a ON a.id = p.acao_id
      JOIN usuarios u ON u.id = p.usuario_id
      WHERE a.organizador_id = $1

      ORDER BY data DESC
      LIMIT 10
    `,
    [organizadorId]
  );
  return result.rows;
};

const toggleCurtida = async (acaoId, voluntarioId) => {
  const result = await query(
    `SELECT * FROM curtidas WHERE acao_id = $1 AND voluntario_id = $2`,
    [acaoId, voluntarioId]
  );
  if (result.rows.length > 0) {
    await query(`DELETE FROM curtidas WHERE acao_id = $1 AND voluntario_id = $2`, [acaoId, voluntarioId]);
    return { liked: false };
  } else {
    await query(`INSERT INTO curtidas (acao_id, voluntario_id) VALUES ($1, $2)`, [acaoId, voluntarioId]);
    return { liked: true };
  }
};

const findCurtidasByVoluntario = async (voluntarioId) => {
  const result = await query(
    `SELECT acao_id FROM curtidas WHERE voluntario_id = $1`,
    [voluntarioId]
  );
  return result.rows.map(row => row.acao_id);
};

module.exports = { findAll, findById, create, updateById, deleteById, findVoluntariosByAcaoId, getAtividadesRecentes, toggleCurtida, findCurtidasByVoluntario };
