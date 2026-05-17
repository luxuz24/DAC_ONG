import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Target, Calendar } from 'lucide-react';
import api from '../../../services/api';
import Spinner from '../../../components/ui/Spinner';

export default function VoluntarioProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api.get(`/usuarios/${id}/perfil-voluntario`)
      .then(res => setPerfil(res.data.data.perfil))
      .catch(err => setErro(err.response?.data?.message || 'Erro ao buscar perfil'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 flex justify-center"><Spinner label="Carregando perfil..." /></div>;
  if (erro) return <div className="p-8 text-center text-red-500">{erro}</div>;
  if (!perfil) return <div className="p-8 text-center text-gray-500">Perfil não encontrado.</div>;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-main)", paddingBottom: "80px" }}>
      {/* Header */}
      <div className="pt-12 px-5 pb-8" style={{ background: "linear-gradient(160deg, #15803D 0%, #16A34A 100%)", borderBottomLeftRadius: "28px", borderBottomRightRadius: "28px" }}>
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center justify-center w-10 h-10 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
          <ArrowLeft size={20} color="white" />
        </button>
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold" style={{ background: "white", color: "#15803D", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            {perfil.nome.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-center">
            <h1 style={{ color: "white", fontWeight: 700, fontSize: "1.4rem" }}>{perfil.nome}</h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem" }}>Voluntário(a) Ativo(a)</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-3xl flex flex-col items-center justify-center text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
            <Target size={24} color="#EA580C" className="mb-2" />
            <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>{perfil.estatisticas.acoes_inscritas}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Ações Inscritas</span>
          </div>
          <div className="p-4 rounded-3xl flex flex-col items-center justify-center text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
            <CheckCircle size={24} color="#15803D" className="mb-2" />
            <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>{perfil.estatisticas.acoes_realizadas}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Ações Realizadas</span>
          </div>
        </div>

        {/* Histórico de Ações */}
        <div>
          <h2 className="mb-3" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>Histórico de Ações</h2>
          <div className="flex flex-col gap-3">
            {perfil.acoes.length === 0 ? <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>Nenhuma ação no histórico.</p> : perfil.acoes.map((acao) => {
              const dataInscricao = new Date(acao.inscrito_em).toLocaleDateString('pt-BR');
              return (
                <div key={acao.id} className="p-4 rounded-3xl flex items-center justify-between" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-12 rounded-full" style={{ background: acao.cor || '#15803D' }} />
                    <div>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>{acao.titulo}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar size={12} color="var(--text-muted)" />
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Inscrito em {dataInscricao}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs" style={{ background: acao.status === 'concluida' || acao.status === 'finalizada' ? '#F0FDF4' : '#FFF7ED', color: acao.status === 'concluida' || acao.status === 'finalizada' ? '#15803D' : '#EA580C', fontWeight: 600 }}>
                    {acao.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
