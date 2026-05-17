import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Send, Paperclip, Smile, MoreVertical, Phone, Video, Check, CheckCheck } from "lucide-react";
import { BottomNav } from "../../../components/BottomNav";
import { useAuth } from "../../../hooks/useAuth";
import useSocket from "../../../hooks/useSocket";
import api from "../../../services/api";

export default function ChatPage() {
  const { acaoId } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const socket = useSocket();

  const [conversations, setConversations] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    document.title = acaoId ? "Chat da Ação | SGAS" : "Mensagens | SGAS";
  }, [acaoId]);

  // Carrega as conversas (ações em que está inscrito ou que organizou)
  useEffect(() => {
    const fetchConvos = async () => {
      try {
        let acoes = [];
        if (usuario.tipo === "voluntario") {
          const res = await api.get('/participacoes/minhas');
          acoes = res.data.data.acoes;
        } else {
          const res = await api.get('/acoes');
          acoes = res.data.data.acoes.filter(a => a.organizador_id === usuario.id);
        }

        const formattedConvos = acoes.map(a => ({
          id: a.id,
          name: a.titulo,
          role: usuario.tipo === "voluntario" ? "Organização" : "Ação",
          lastMessage: "Toque para abrir o chat...",
          time: new Date(a.data).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' }),
          unread: 0,
          online: false,
          color: a.cor || (usuario.tipo === "voluntario" ? "#15803D" : "#EA580C"),
          initials: a.titulo.substring(0, 2).toUpperCase(),
        }));
        setConversations(formattedConvos);
      } catch (err) {
        console.error("Erro ao carregar conversas", err);
      } finally {
        setLoadingConvos(false);
      }
    };
    fetchConvos();
  }, [usuario]);

  // Carrega histórico e conecta ao socket se tiver acaoId
  useEffect(() => {
    if (!acaoId) return;

    api.get(`/chat/${acaoId}/historico`)
      .then((res) => setMessages(res.data.data.historico || []))
      .catch((err) => console.error("Erro histórico", err));

    socket.emit('join_room', { acaoId });

    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive_message', handleReceive);

    return () => {
      socket.emit('leave_room', { acaoId });
      socket.off('receive_message', handleReceive);
    };
  }, [acaoId, socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !acaoId) return;
    socket.emit('send_message', { acaoId, mensagem: message });
    setMessage("");
  };

  const activeConvo = conversations.find((c) => c.id === acaoId) || {
    id: acaoId,
    name: "Chat da Ação",
    role: "Grupo",
    color: "#15803D",
    initials: "CH"
  };

  if (acaoId) {
    return (
      <div className="flex flex-col fixed inset-0 z-50" style={{ background: "var(--bg-main)" }}>
        {/* Chat header */}
        <header
          className="pt-14 px-4 pb-3 flex items-center gap-3"
          style={{ background: "linear-gradient(160deg, #1C1C2E 0%, #2D1B4E 100%)" }}
        >
          <button onClick={() => navigate("/chat")} aria-label="Voltar para a lista de chats" className="focus:outline-none focus:ring-2 focus:ring-white rounded-full">
            <ArrowLeft size={22} color="white" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: activeConvo.color, fontWeight: 700, color: "white", fontSize: "0.85rem" }}
              >
                {activeConvo.initials}
              </div>
            </div>
            <div>
              <h1 style={{ color: "white", fontWeight: 600, fontSize: "0.95rem" }}>{activeConvo.name}</h1>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>
                {activeConvo.role}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button aria-label="Opções do chat" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full p-1"><MoreVertical size={18} color="rgba(255,255,255,0.9)" aria-hidden="true" /></button>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
          {messages.length === 0 ? (
             <p className="text-center text-sm py-8" style={{ color: "var(--text-muted)" }}>
               Seja o primeiro a enviar uma mensagem!
             </p>
          ) : messages.map((msg) => {
            const isMe = msg.remetente_id === usuario?.id;
            const msgTime = new Date(msg.enviado_em).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center mr-2 shrink-0 self-end mb-1"
                    style={{ background: activeConvo.color, fontSize: "0.6rem", color: "white", fontWeight: 700 }}
                  >
                    {msg.remetente_nome ? msg.remetente_nome[0].toUpperCase() : "U"}
                  </div>
                )}
                <div style={{ maxWidth: "72%" }}>
                  {!isMe && (
                     <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)", marginBottom: "2px", marginLeft: "4px" }}>
                       {msg.remetente_nome}
                     </div>
                  )}
                  <div
                    className="px-4 py-3 rounded-2xl"
                    style={{
                      background: isMe
                        ? "linear-gradient(135deg, #EA580C, #F97316)"
                        : "white",
                      color: isMe ? "white" : "#1C1C1E",
                      borderBottomRightRadius: isMe ? "6px" : "18px",
                      borderBottomLeftRadius: isMe ? "18px" : "6px",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      boxShadow: isMe ? "0 4px 12px rgba(234,88,12,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
                      wordBreak: "break-word"
                    }}
                  >
                    {msg.mensagem}
                  </div>
                  <div
                    className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <span style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>{msgTime}</span>
                    {isMe && <CheckCheck size={12} color="#3B82F6" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </main>

        {/* Input */}
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{
            background: "var(--bg-card)",
            borderTop: "1px solid var(--border-color)",
            paddingBottom: "24px",
          }}
        >
          <div
            className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl transition-all"
            style={{ background: "var(--bg-input)" }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escreva uma mensagem..."
              className="flex-1 bg-transparent outline-none focus:ring-0 focus:outline-none"
              style={{ fontSize: "0.875rem", color: "var(--text-primary)", outline: "none", boxShadow: "none" }}
              aria-label="Campo de mensagem"
            />
            <button aria-label="Inserir emoji" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-full">
              <Smile size={18} color="#4B5563" aria-hidden="true" />
            </button>
          </div>
          <button
            onClick={sendMessage}
            className="w-10 h-10 rounded-2xl flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            aria-label="Enviar mensagem"
            style={{
              background: message.trim()
                ? "linear-gradient(135deg, #EA580C, #F97316)"
                : "var(--bg-disabled)",
              transition: "all 0.2s",
            }}
          >
            <Send size={16} color={message.trim() ? "white" : "#9CA3AF"} aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  // Lista de conversas
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-main)", paddingBottom: "80px" }}>
      {/* Header */}
      <header
        className="pt-14 px-5 pb-5"
        style={{
          background: "linear-gradient(160deg, #1C1C2E 0%, #2D1B4E 100%)",
          borderBottomLeftRadius: "28px",
          borderBottomRightRadius: "28px",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 style={{ color: "white", fontWeight: 700, fontSize: "1.3rem" }}>Mensagens</h1>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ background: "rgba(255,255,255,0.1)" }}
            aria-label="Mais opções"
          >
            <MoreVertical size={16} color="white" aria-hidden="true" />
          </button>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Search size={15} color="rgba(255,255,255,0.7)" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar conversa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none focus:ring-0 focus:outline-none w-full text-sm placeholder-white/60 text-white"
            aria-label="Buscar conversa"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col">
      <div className="px-5 pt-4 pb-2">
        <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Suas Ações ({conversations.length})
        </span>
      </div>

      {/* Conversation list */}
      <div className="flex-1 px-5 flex flex-col gap-2">
        {loadingConvos ? (
          <p className="text-center text-sm text-surface-400 py-8" role="status">Carregando...</p>
        ) : conversations.length === 0 ? (
          <p className="text-center text-sm text-surface-400 py-8">Nenhuma conversa encontrada.</p>
        ) : conversations.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((convo) => (
          <button
            key={convo.id}
            onClick={() => navigate(`/chat/${convo.id}`)}
            className="flex items-center gap-3 p-3 rounded-2xl transition-all active:scale-98 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label={`Abrir chat ${convo.name}`}
            style={{
              background: "var(--bg-card)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="relative shrink-0">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: convo.color, fontWeight: 700, color: "white", fontSize: "0.85rem" }}
              >
                {convo.initials}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.9rem" }}>
                  {convo.name}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>{convo.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.8rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "200px",
                  }}
                >
                  {convo.lastMessage}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
      </main>

      <BottomNav />
    </div>
  );
}
