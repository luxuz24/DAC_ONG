import { useState, useEffect } from "react";
import {
  Bell, MapPin, Clock, Users, Heart, ChevronRight,
  Star, Calendar, CheckCircle, Search, Filter
} from "lucide-react";
import { BottomNav } from "../../../components/BottomNav";
import { useAuth } from "../../../hooks/useAuth";
import { listar, toggleCurtida, minhasCurtidas } from "../services/acoes.service";
import { inscrever, minhasAcoes, minhasStats } from "../../participacoes/services/participacoes.service";

export default function AcoesListPage() {
  const { usuario } = useAuth();
  const [acoes, setAcoes] = useState([]);
  const [participacoes, setParticipacoes] = useState([]);
  const [statsData, setStatsData] = useState({ acoes_count: 0, horas_count: 0, impactados_count: 0 });
  
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [likedActions, setLikedActions] = useState([]);

  const toggleLike = async (id) => {
    try {
      const res = await toggleCurtida(id);
      const isLiked = res.data.data.liked;
      setLikedActions(prev => isLiked ? [...prev, id] : prev.filter(a => a !== id));
    } catch (err) {
      console.error("Erro ao curtir ação:", err);
    }
  };
  
  const firstName = usuario?.nome?.split(" ")[0] || "Voluntário";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  useEffect(() => {
    document.title = `${firstName} | SGAS`;
  }, [firstName]);

  const filters = ["Todos", "Próximos", "Presencial", "Online"];

  const carregarDados = async () => {
    setLoading(true);
    try {
      const resAcoes = await listar();
      setAcoes(resAcoes.data.data.acoes);

      if (usuario?.tipo === 'voluntario') {
        const [resParticipacoes, resStats, resCurtidas] = await Promise.all([
          minhasAcoes(),
          minhasStats(),
          minhasCurtidas()
        ]);
        setParticipacoes(resParticipacoes.data.data.acoes.map(a => a.id));
        setStatsData(resStats.data.data.stats);
        setLikedActions(resCurtidas.data.data.curtidas || []);
      } else {
        // Se não for voluntário, não busca estatísticas
        setParticipacoes([]);
        setLikedActions([]);
        setStatsData({ acoes_count: 0, horas_count: 0, impactados_count: 0 });
      }
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleParticipar = async (acaoId) => {
    try {
      await inscrever(acaoId);
      carregarDados();
    } catch (err) {
      alert(err.response?.data?.message || "Erro ao se inscrever.");
    }
  };

  const stats = [
    { label: "Ações", value: statsData.acoes_count, icon: Heart, color: "#EA580C", bg: "#FFF7ED" },
    { label: "Horas", value: statsData.horas_count, icon: Clock, color: "#15803D", bg: "#F0FDF4" },
    { label: "Impactados", value: statsData.impactados_count, icon: Users, color: "#7C3AED", bg: "#F5F3FF" },
  ];

  const getBgColor = (cor) => cor === "#EA580C" ? "#FFF7ED" : cor === "#15803D" ? "#F0FDF4" : cor === "#7C3AED" ? "#F5F3FF" : "#F0F9FF";

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
        <div className="flex items-center justify-between mb-5">
          <div>
            {/* Exibe uma saudação dinâmica com base no horário do dia (ex: Bom dia, Boa tarde, Boa noite) */}
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>{greeting}</p>
            {/* Exibe o primeiro nome do voluntário logado com destaque semântico */}
            <h1 style={{ color: "white", fontWeight: 700, fontSize: "1.3rem" }}>{firstName}</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Removed notification button */}
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ background: "#FFFFFF", border: "1px solid var(--border-color)", color: "#1F2937", fontWeight: 700, fontSize: "1.1rem" }}
            >
              {firstName[0]}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="flex-1 py-3 px-3 rounded-2xl text-center"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1.5"
                style={{ background: color }}
              >
                <Icon size={14} color="white" />
              </div>
              <div style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.2 }}>{value}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.65rem", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1">
        {/* Search */}
      <div className="px-5 pt-5 pb-3">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-orange-500/50"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <Search size={17} color="#9CA3AF" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar ações solidárias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm focus:ring-0"
            style={{ color: "var(--text-primary)" }}
            aria-label="Buscar ações solidárias"
            id="search-acoes-input"
          />
          <div className="ml-auto">
            <Filter size={17} color="#9CA3AF" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-5 pb-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="px-4 py-1.5 rounded-full whitespace-nowrap text-sm transition-all"
            style={{
              background: activeFilter === f ? "#9A3412" : "white",
              color: activeFilter === f ? "white" : "#4B5563",
              border: activeFilter === f ? "none" : "1px solid #E5E7EB",
              fontWeight: activeFilter === f ? 600 : 400,
              boxShadow: activeFilter === f ? "0 4px 12px rgba(154,52,18,0.25)" : "none",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Section heading */}
      <div className="px-5 flex items-center justify-between mb-3">
        <h2 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "1.05rem" }}>Ações disponíveis</h2>
        <button 
          onClick={() => { setActiveFilter("Todos"); setSearchQuery(""); }}
          className="flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1" 
          style={{ color: "#9A3412", fontSize: "0.8rem", fontWeight: 600 }}
          aria-label="Ver todas as ações (limpa filtros)"
        >
          Ver todas <ChevronRight size={14} aria-hidden="true" />
        </button>
      </div>

      {/* Action cards */}
      <div className="px-5 flex flex-col gap-3 pb-4">
        {loading ? (
          <p className="text-center text-gray-500 py-4">Carregando...</p>
        ) : acoes.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Nenhuma ação disponível.</p>
        ) : (
          acoes.filter((action) => {
            const query = searchQuery.toLowerCase();
            const isLiked = likedActions.includes(action.id);
            return (
              action.titulo?.toLowerCase().includes(query) ||
              action.organizador_nome?.toLowerCase().includes(query) ||
              action.local?.toLowerCase().includes(query)
            ) && (activeFilter === "Todos" || action.categoria === activeFilter || action.tipo_local === activeFilter);
          }).map((action) => {
            const isConfirmado = participacoes.includes(action.id);
            const isLiked = likedActions.includes(action.id);
            const bgColor = getBgColor(action.cor);
            const displayDate = new Date(action.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
            
            return (
              <div
                key={action.id}
                className="rounded-3xl overflow-hidden"
                style={{
                  background: "var(--bg-card)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {/* Color accent bar */}
                <div style={{ height: "4px", background: `linear-gradient(90deg, ${action.cor}, ${action.cor}88)` }} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{ background: bgColor, color: action.cor, fontWeight: 600 }}
                        >
                          {action.categoria}
                        </span>
                        {isConfirmado && (
                          <CheckCircle size={14} color="#15803D" />
                        )}
                      </div>
                      <h3 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.3 }}>
                        {action.titulo}
                      </h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", marginTop: "2px" }}>{action.organizador_nome}</p>
                    </div>
                    <button
                      onClick={() => toggleLike(action.id)}
                      className="w-9 h-9 rounded-2xl flex items-center justify-center ml-2 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                      style={{ background: bgColor }}
                      aria-label={isLiked ? "Descurtir ação" : "Curtir ação"}
                      aria-pressed={isLiked}
                    >
                      <Heart size={16} color={action.cor} fill={isLiked ? action.cor : "none"} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} color="#4B5563" aria-hidden="true" />
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}>{action.local}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={13} color="#4B5563" aria-hidden="true" />
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}>{displayDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(Math.min(3, parseInt(action.inscritos) || 1))].map((_, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"
                            style={{
                              background: `hsl(${i * 60 + 20}, 70%, 25%)`,
                              marginLeft: i > 0 ? "-8px" : "0",
                              fontSize: "0.5rem", color: "white", fontWeight: 700,
                            }}
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                      </div>
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>
                        {action.inscritos}/{action.vagas}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>4.9</span>
                    </div>

                    {/* Botão para se inscrever ou indicar que a participação na ação já está confirmada */}
                    <button
                      onClick={() => !isConfirmado && handleParticipar(action.id)} // Executa inscrição caso não confirmado
                      disabled={isConfirmado} // Desabilita o clique se já estiver confirmado
                      className="px-4 py-2 rounded-2xl text-sm transition-transform active:scale-95"
                      style={{
                        background: isConfirmado
                          ? "#F0FDF4"
                          : `linear-gradient(135deg, ${action.cor}, #9A3412)`,
                        color: isConfirmado ? "#166534" : "white",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                      }}
                    >
                      {isConfirmado ? "Confirmado" : "Participar"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      </main>

      <BottomNav />
    </div>
  );
}
