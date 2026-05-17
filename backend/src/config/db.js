// Importa a classe Pool do módulo pg (node-postgres) para gerenciar conexões
const { Pool } = require('pg');
// Obtém a string de conexão configurada a partir do módulo env
const { databaseUrl } = require('./env');

// Instancia o Pool de conexões do PostgreSQL
const pool = new Pool({
  connectionString: databaseUrl,
  // Ativa SSL se em produção com verificação flexível de certificado
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Escuta evento de nova conexão estabelecida no Pool
pool.on('connect', () => {
  // Registra no console que a conexão foi efetuada com sucesso
  console.log('[BD] Conectado ao PostgreSQL com sucesso');
});

// Escuta eventos de erro inesperados em conexões ociosas
pool.on('error', (err) => {
  // Registra a mensagem detalhada do erro no console de erros
  console.error('[ERRO] Erro inesperado no pool do PostgreSQL:', err.message);
  // Finaliza a aplicação de forma segura indicando falha crítica
  process.exit(1);
});

/**
 * Executa uma query SQL parametrizada no banco de dados.
 * @param {string} text - Instrução SQL a ser executada
 * @param {Array} params - Parâmetros para substituição segura ($1, $2, etc.)
 */
const query = (text, params) => pool.query(text, params);

/**
 * Obtém um cliente individual do Pool para controle manual de transações.
 */
const getClient = () => pool.connect();

// Exporta as funções e a instância principal do pool
module.exports = { query, getClient, pool };
