/**
 * Script de migração — executa todos os arquivos .sql em ordem.
 * Uso: node database/migrate.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const migrationsDir = path.join(__dirname, 'migrations');

const run = async () => {
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (!file.endsWith('.sql')) continue;
    // Lê o conteúdo SQL da migração correspondente
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    // Registra o início da execução da migração no console
    console.log(`[EXEC] Executando migracao: ${file}`);
    // Executa a instrução SQL diretamente no banco de dados de forma assíncrona
    await pool.query(sql);
    // Registra a confirmação de execução com sucesso
    console.log(`[OK] Migracao concluida: ${file}`);
  }

  // Registra que todo o lote de migrações foi processado com absoluto sucesso
  console.log('\n[SUCESSO] Todas as migracoes foram executadas com sucesso!');
  // Finaliza a conexão com o pool de banco de dados do PostgreSQL
  await pool.end();
};

// Executa a função principal capturando e tratando possíveis falhas
run().catch((err) => {
  // Registra o erro de migração no console de erros
  console.error('[ERRO] Erro ocorrido na migracao:', err.message);
  process.exit(1);
});
