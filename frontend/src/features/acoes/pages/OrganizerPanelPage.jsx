import { useState, useEffect } from "react";
import {
  Users, TrendingUp, Clock, Target, Plus,
  CheckCircle, Calendar, ChevronRight, Bell, Star, Activity,
  ArrowUpRight, Layers, Search
} from "lucide-react";
import { BottomNav } from "../../../components/BottomNav";
import { useAuth } from "../../../hooks/useAuth";
import { listar } from "../services/acoes.service";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

const weekData = [
  { day: "Seg", hours: 45, actions: 3 },
  { day: "Ter", hours: 60, actions: 4 },
  { day: "Qua", hours: 30, actions: 2 },
  { day: "Qui", hours: 80, actions: 6 },
  { day: "Sex", hours: 55, actions: 5 },
  { day: "Sáb", hours: 95, actions: 7 },
  { day: "Dom", hours: 40, actions: 4 },
];

const maxHours = Math.max(...weekData.map((d) => d.hours));

const volunteers = [
  { name: "Ana Silva", actions: 12, hours: 48, rating: 4.9, status: "ativo", initial: "A", color: "#EA580C" },
  { name: "João Souza", actions: 8, hours: 32, rating: 4.7, status: "ativo", initial: "J", color: "#15803D" },
  { name: "Lucia Fernandes", actions: 15, hours: 60, rating: 5.0, status: "destaque", initial: "L", color: "#7C3AED" },
  { name: "Rafael Costa", actions: 5, hours: 20, rating: 4.5, status: "novo", initial: "R", color: "#D97706" },
];

export default function OrganizerPanelPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [minhasAcoes, setMinhasAcoes] = useState([]);
  const [voluntariosList, setVoluntariosList] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const nome = usuario?.nome || "Organizador";
    document.title = `${nome} | SGAS`;
  }, [usuario?.nome]);

  useEffect(() => {
    listar()
      .then(res => {
        const todasAcoes = res.data.data.acoes;
        const acoesDoOrganizador = todasAcoes.filter(a => a.organizador_id === usuario?.id);
        setMinhasAcoes(acoesDoOrganizador);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    api.get('/usuarios/voluntarios')
      .then(res => setVoluntariosList(res.data.data.voluntarios))
      .catch(err => console.error(err));

    api.get('/acoes/atividades/recentes')
      .then(res => setAtividades(res.data.data.atividades))
      .catch(err => console.error(err));
  }, [usuario]);

  const stats = [
    { label: "Voluntários", value: "127", change: "+12", icon: Users, color: "#15803D", bg: "#F0FDF4" },
    { label: "Ações ativas", value: minhasAcoes.length.toString(), change: "+3", icon: Layers, color: "#EA580C", bg: "#FFF7ED" },
    { label: "Horas totais", value: "1.4k", change: "+8%", icon: Clock, color: "#7C3AED", bg: "#F5F3FF" },
    { label: "Taxa retenção", value: "87%", change: "+5%", icon: Target, color: "#0891B2", bg: "#F0F9FF" },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-main)", paddingBottom: "80px" }}>
      {/* Header */}
      <header
        className="pt-14 px-5 pb-5"
        style={{
          background: "linear-gradient(160deg, #0F2027 0%, #203A43 50%, #1a3a1a 100%)",
          borderBottomLeftRadius: "28px",
          borderBottomRightRadius: "28px",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>Painel de Controle</p>
            <h1 style={{ color: "white", fontWeight: 700, fontSize: "1.3rem" }}>{usuario?.nome || "Organizador"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ background: "#FFFFFF", border: "1px solid var(--border-color)", color: "#1F2937", fontWeight: 700, fontSize: "1.1rem" }}
            >
              {usuario?.nome?.substring(0,2).toUpperCase() || "OR"}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value, change, icon: Icon, color }) => (
            <div
              key={label}
              className="p-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: color }}
                >
                  <Icon size={14} color="white" />
                </div>
                <div className="flex items-center gap-0.5" style={{ color: "#4ADE80", fontSize: "0.7rem", fontWeight: 600 }}>
                  <ArrowUpRight size={10} />
                  {change}
                </div>
              </div>
              <div style={{ color: "white", fontWeight: 700, fontSize: "1.3rem", lineHeight: 1.1 }}>{value}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.7rem", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col">
      {/* Tabs */}
      <div className="px-5 pt-4 flex gap-2">
        {(["overview", "volunteers", "actions"]).map((tab) => {
          const labels = { overview: "Visão Geral", volunteers: "Voluntários", actions: "Ações" };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-2xl text-sm transition-all"
              style={{
                background: activeTab === tab ? "#166534" : "white",
                color: activeTab === tab ? "white" : "#4B5563",
                fontWeight: activeTab === tab ? 600 : 400,
                border: activeTab === tab ? "none" : "1px solid #E5E7EB",
                boxShadow: activeTab === tab ? "0 4px 12px rgba(22,101,52,0.25)" : "none",
              }}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {activeTab !== "overview" && (
        <div className="px-5 pt-4">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-green-500/50"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <Search size={17} color="#9CA3AF" aria-hidden="true" />
            <input
              type="text"
              placeholder={activeTab === "volunteers" ? "Buscar voluntários..." : "Buscar ações..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm focus:ring-0"
              style={{ color: "var(--text-primary)" }}
              aria-label={activeTab === "volunteers" ? "Buscar voluntários" : "Buscar ações"}
            />
          </div>
        </div>
      )}

      <div className="flex-1 px-5 pt-4 pb-4 flex flex-col gap-4">
        {activeTab === "overview" && (
          <>
            {/* Weekly chart */}
            <div
              className="p-4 rounded-3xl"
              style={{
                background: "var(--bg-card)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "0.95rem" }}>Atividade Semanal</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Horas de voluntariado</p>
                </div>
                <div className="flex items-center gap-1" style={{ color: "#166534", fontSize: "0.8rem", fontWeight: 600 }}>
                  <Activity size={14} />
                  <span>+18%</span>
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex items-end gap-2 h-24">
                {weekData.map((d, i) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-lg transition-all"
                      style={{
                        height: `${(d.hours / maxHours) * 80}px`,
                        background: i === 5
                          ? "linear-gradient(180deg, #15803D, #16A34A)"
                          : "linear-gradient(180deg, #D1FAE5, #6EE7B7)",
                        minHeight: "4px",
                      }}
                    />
                    <span style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div
              className="p-4 rounded-3xl"
              style={{ background: "var(--bg-card)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border-color)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "0.95rem" }}>Atividade Recente</h3>
                <button 
                  onClick={() => setActiveTab("actions")}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded px-1"
                  style={{ color: "#166534", fontSize: "0.8rem", fontWeight: 600 }}
                  aria-label="Ver todas as ações na aba Ações"
                >
                  Ver tudo
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {atividades.length === 0 ? (
                  <p className="text-center text-sm" style={{ color: "var(--text-muted)", padding: "10px 0" }}>Nenhuma atividade ainda.</p>
                ) : (
                  atividades.map((item, i) => {
                    const isNovaAcao = item.tipo === 'nova_acao';
                    const icon = isNovaAcao ? Plus : CheckCircle;
                    const text = isNovaAcao ? `Nova ação publicada: ${item.titulo}` : `${item.voluntario_nome} se inscreveu em ${item.titulo}`;
                    
                    const now = new Date();
                    const itemDate = new Date(item.data);
                    const diffMs = now - itemDate;
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                    const timeStr = diffHours < 1 ? 'agora mesmo' : (diffHours < 24 ? `há ${diffHours}h` : `há ${Math.floor(diffHours/24)}d`);

                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: `${item.cor || '#15803D'}15` }}
                        >
                          {isNovaAcao ? <Plus size={14} color={item.cor || '#15803D'} /> : <CheckCircle size={14} color={item.cor || '#15803D'} />}
                        </div>
                        <div>
                          <p style={{ color: "var(--text-primary)", fontSize: "0.82rem", fontWeight: 500 }}>{text}</p>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>{timeStr}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "volunteers" && (
          <div className="flex flex-col gap-3">
            {voluntariosList.length === 0 ? <p className="text-center text-gray-500 py-4">Nenhum voluntário encontrado.</p> : voluntariosList.filter(v => v.nome.toLowerCase().includes(searchQuery.toLowerCase())).map((v) => (
              <button
                key={v.id}
                onClick={() => navigate(`/voluntario/${v.id}`)}
                className="w-full text-left p-4 rounded-3xl flex items-center gap-3 transition-transform active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                style={{ background: "var(--bg-card)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border-color)" }}
                aria-label={`Ver perfil do voluntário ${v.nome}`}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, #15803D, #16A34A)`, fontWeight: 700, color: "white" }}
                >
                  {v.nome.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.9rem" }}>{v.nome}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>Voluntário Ativo</span>
                  </div>
                </div>
                <div><ChevronRight size={18} color="#D1D5DB" /></div>
              </button>
            ))}
          </div>
        )}

        {activeTab === "actions" && (
          <div className="flex flex-col gap-3">
            {loading ? <p className="text-center text-gray-500 py-4">Carregando...</p> : minhasAcoes.length === 0 ? <p className="text-center text-gray-500 py-4">Nenhuma ação encontrada.</p> : minhasAcoes.filter(a => a.titulo.toLowerCase().includes(searchQuery.toLowerCase())).map((action) => {
              const displayDate = new Date(action.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
              return (
              <div
                key={action.id}
                className="p-4 rounded-3xl"
                style={{ background: "var(--bg-card)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border-color)" }}
              >
                <div style={{ height: "3px", background: `linear-gradient(90deg, ${action.cor}, ${action.cor}44)`, borderRadius: "2px", marginBottom: "12px" }} />
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "0.95rem" }}>{action.titulo}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar size={12} color="#4B5563" aria-hidden="true" />
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>{displayDate}</span>
                    </div>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      background: action.status === "em andamento" ? "#FFF7ED" : "#F0FDF4",
                      color: action.status === "em andamento" ? "#EA580C" : "#15803D",
                      fontWeight: 600,
                    }}
                  >
                    {action.status}
                  </span>
                </div>
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>Inscritos</span>
                    <span style={{ color: "var(--text-primary)", fontSize: "0.75rem", fontWeight: 600 }}>
                      {action.inscritos || 0}/{action.vagas || 20}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${((action.inscritos || 0) / (action.vagas || 20)) * 100}%`,
                        background: `linear-gradient(90deg, ${action.cor}, ${action.cor}88)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )})}
            {/* New action button */}
            <button
              onClick={() => navigate('/acoes/nova')}
              className="w-full py-4 rounded-3xl flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition-colors hover:bg-green-50"
              style={{
                border: "2px dashed #D1FAE5",
                color: "#15803D",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
              aria-label="Criar nova ação"
            >
              <Plus size={18} color="#15803D" aria-hidden="true" />
              Criar nova ação
            </button>
          </div>
        )}
      </div>
      </main>

      <BottomNav />
    </div>
  );
}
