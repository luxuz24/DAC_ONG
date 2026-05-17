// Carrega as variáveis do arquivo .env para o objeto process.env
require('dotenv').config();

// Define as variáveis de ambiente cujo preenchimento é obrigatório
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

// Varre a lista de variáveis obrigatórias para verificar a presença de cada uma
requiredEnvVars.forEach((key) => {
  // Se a variável de ambiente não estiver definida, interrompe o sistema
  if (!process.env[key]) {
    // Exibe mensagem de erro indicando qual variável de ambiente está ausente
    console.error(`[ERRO] Variavel de ambiente obrigatoria nao encontrada: ${key}`);
    // Encerra a execução do processo com sinal de falha crítica
    process.exit(1);
  }
});

// Exporta as variáveis de ambiente formatadas e com valores de fallback seguros
module.exports = {
  // Porta para escuta do servidor HTTP (padrão: 3001)
  port: process.env.PORT || 3001,
  // URL de conexão com o banco de dados PostgreSQL
  databaseUrl: process.env.DATABASE_URL,
  // Segredo usado na assinatura e validação dos tokens JWT
  jwtSecret: process.env.JWT_SECRET,
  // Tempo de expiração padrão para as chaves JWT (padrão: 7 dias)
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // URL de origem do cliente frontend para políticas de CORS (padrão: localhost:5173)
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
