// Importa o pacote jsonwebtoken para verificação de tokens de autenticação
const jwt = require('jsonwebtoken');
// Importa o serviço de gerenciamento lógico do chat
const chatService = require('./chat.service');
// Importa o segredo de assinatura JWT das configurações globais do ambiente
const { jwtSecret } = require('../../config/env');
// Importa a função auxiliar de consulta do banco de dados relacional
const { query } = require('../../config/db');

/**
 * Módulo principal responsável por controlar o gateway do WebSocket (Socket.io) para chat em tempo real.
 * Autentica conexões utilizando JWT e segmenta usuários em salas dedicadas por Ação Solidária.
 *
 * Eventos recebidos:
 *   join_room   - Adiciona o cliente ao canal de escuta de uma ação específica.
 *   send_message - Salva a mensagem no banco e a retransmite para a sala correspondente.
 *   leave_room  - Remove o cliente do canal da ação ativa.
 *
 * Eventos emitidos:
 *   receive_message - Entrega uma mensagem nova aos integrantes do chat.
 *   user_joined     - Notifica os demais integrantes da entrada de um novo usuário.
 *   error           - Notifica o cliente emissor sobre erros operacionais.
 */
const chatGateway = (io) => {
  // Configura middleware interno do Socket.io para interceptar e autenticar handshakes com JWT
  io.use((socket, next) => {
    // Recupera a chave JWT contida na camada de handshake fornecida pelo cliente
    const token = socket.handshake.auth?.token;
    // Se nenhum token for enviado, impede a conexão emitindo erro semântico
    if (!token) {
      return next(new Error('Token não fornecido.'));
    }
    try {
      // Valida o token e decodifica os payloads anexados ao segredo do JWT
      const decoded = jwt.verify(token, jwtSecret);
      // Salva os metadados do usuário logado na própria instância do socket
      socket.usuario = decoded; // Estrutura: { id, nome, tipo }
      // Autoriza a continuidade da conexão do socket com o servidor
      next();
    } catch {
      // Retorna erro informando token corrompido ou expirado
      next(new Error('Token inválido.'));
    }
  });

  // Escuta novos sockets autorizados que se conectarem ao ecossistema
  io.on('connection', (socket) => {
    // Registra a abertura de conexão exibindo identificador do socket e nome do usuário logado
    console.log(`[SOCKET] Conexao estabelecida: ${socket.id} (${socket.usuario.nome})`);

    // Trata requisição do cliente para ingressar em uma sala específica de Ação
    socket.on('join_room', ({ acaoId }) => {
      // Vincula a instância deste socket à sala lógica dedicada àquela Ação
      socket.join(`acao_${acaoId}`);
      // Notifica os demais membros ativos da sala informando o ingresso do usuário
      socket.to(`acao_${acaoId}`).emit('user_joined', { nome: socket.usuario.nome });
    });

    // Trata o envio de uma mensagem de texto por parte do cliente
    socket.on('send_message', async ({ acaoId, mensagem }) => {
      try {
        // Executa busca no banco para reaver o nome atualizado do remetente
        const userRes = await query('SELECT nome FROM usuarios WHERE id = $1', [socket.usuario.id]);
        const nomeRemetente = userRes.rows[0]?.nome || 'Usuário';

        // Salva a mensagem permanentemente no banco de dados
        const msg = await chatService.salvarMensagem(mensagem, socket.usuario.id, acaoId);
        // Transmite o objeto completo da mensagem a todos os clientes conectados à sala
        io.to(`acao_${acaoId}`).emit('receive_message', {
          ...msg,
          remetente_nome: nomeRemetente,
        });
      } catch (err) {
        // Registra falha de envio no console local de depuração
        console.error("Erro no processamento de send_message:", err);
        // Responde diretamente ao emissor com o erro ocorrido
        socket.emit('error', { message: 'Falha ao salvar mensagem.' });
      }
    });

    // Trata requisição do cliente para desvincular-se da sala da ação ativa
    socket.on('leave_room', ({ acaoId }) => {
      // Remove o socket da sala lógica
      socket.leave(`acao_${acaoId}`);
    });

    // Escuta pelo encerramento de conexão do socket
    socket.on('disconnect', () => {
      // Registra o desligamento do socket do cliente no terminal
      console.log(`[SOCKET] Conexao encerrada: ${socket.id}`);
    });
  });
};

// Exporta o gateway para integração no setup do servidor principal
module.exports = chatGateway;
