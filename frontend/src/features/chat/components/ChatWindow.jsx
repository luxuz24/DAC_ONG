import { useEffect, useRef, useState } from 'react';
import useSocket from '../../../hooks/useSocket';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import Spinner from '../../../components/ui/Spinner';

/**
 * Janela de chat em tempo real para uma ação.
 *
 * Props:
 *  - acaoId: string
 *  - acaoTitulo: string
 */
const ChatWindow = ({ acaoId, acaoTitulo }) => {
  const { usuario } = useAuth();
  const socket = useSocket();
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  // Carrega histórico via REST
  useEffect(() => {
    api.get(`/chat/${acaoId}/historico`)
      .then((res) => setMensagens(res.data.data.historico || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [acaoId]);

  // Entra na sala e escuta novos eventos
  useEffect(() => {
    socket.emit('join_room', { acaoId });

    socket.on('receive_message', (msg) => {
      setMensagens((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit('leave_room', { acaoId });
      socket.off('receive_message');
    };
  }, [socket, acaoId]);

  // Scroll automático ao fundo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const handleEnviar = (texto) => {
    socket.emit('send_message', { acaoId, mensagem: texto });
  };

  return (
    <section
      aria-labelledby="chat-heading"
      className="flex h-full flex-col rounded-2xl border border-surface-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Cabeçalho da janela do chat */}
      <div className="border-b border-surface-100 px-4 py-3">
        {/* Título descritivo associado por ID para garantir a semântica de acessibilidade */}
        <h2 id="chat-heading" className="text-sm font-semibold text-surface-900">
          Chat — {acaoTitulo}
        </h2>
      </div>

      {/* Mensagens */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Mensagens do chat"
        aria-atomic="false"
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
      >
        {loading ? (
          <Spinner label="Carregando mensagens..." />
        ) : mensagens.length === 0 ? (
          <p className="text-center text-sm text-surface-400 py-8">
            Seja o primeiro a enviar uma mensagem!
          </p>
        ) : (
          mensagens.map((msg) => (
            <MessageBubble
              key={msg.id}
              mensagem={msg}
              isMinha={msg.remetente_id === usuario?.id}
            />
          ))
        )}
        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* Input */}
      <MessageInput onEnviar={handleEnviar} />
    </section>
  );
};

export default ChatWindow;
