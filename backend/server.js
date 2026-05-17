// Importa o módulo nativo HTTP do Node.js
const http = require('http');
// Carrega e valida as variáveis de ambiente necessárias
require('./src/config/env');

// Importa a instância configurada do Express
const app = require('./src/app');
// Importa o inicializador do WebSocket (Socket.io)
const { initSocket } = require('./src/config/socket');
// Obtém a porta definida nas configurações do ambiente
const { port } = require('./src/config/env');

// Cria o servidor HTTP acoplando o app Express
const httpServer = http.createServer(app);

// Inicializa o servidor Socket.io compartilhando o mesmo canal HTTP
initSocket(httpServer);

// Inicia a escuta na porta especificada
httpServer.listen(port, () => {
  // Registra que o servidor HTTP Express está ativo e rodando
  console.log(`[INFO] Servidor rodando em http://localhost:${port}`);
  // Registra que a escuta WebSocket também está ativa
  console.log(`[INFO] WebSocket pronto na mesma porta`);
});
