const { Server } = require('socket.io');
const { clientUrl } = require('./env');
const chatGateway = require('../features/chat/chat.gateway');

/**
 * Inicializa o Socket.io no servidor HTTP.
 * @param {http.Server} httpServer
 */
const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: clientUrl,
      methods: ['GET', 'POST'],
    },
  });

  chatGateway(io);

  return io;
};

module.exports = { initSocket };
