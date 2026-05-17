import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

/**
 * Hook que cria e gerencia uma conexão Socket.io autenticada.
 * A conexão é criada uma vez e reutilizada (singleton por componente).
 *
 * @returns {import('socket.io-client').Socket}
 */
const useSocket = () => {
  const socketRef = useRef(null);

  if (!socketRef.current) {
    const token = localStorage.getItem('sgas_token');
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001', {
      auth: { token },
      autoConnect: true,
    });
  }

  useEffect(() => {
    const socket = socketRef.current;
    if (socket && socket.disconnected) {
      socket.connect();
    }
    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
};

export default useSocket;
