import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Spinner from '../../../components/ui/Spinner';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import AcaoVoluntariosList from '../components/AcaoVoluntariosList';
import ParticipacaoButton from '../../participacoes/components/ParticipacaoButton';
import { buscarPorId, excluir } from '../services/acoes.service';
import { minhasAcoes } from '../../participacoes/services/participacoes.service';
import { formatarData } from '../../../utils/formatDate';
import { useAuth } from '../../../hooks/useAuth';

const AcaoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAutenticado, isOrganizador, isVoluntario, usuario } = useAuth();

  const [acao, setAcao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [jaInscrito, setJaInscrito] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const carregarAcao = useCallback(() => {
    setLoading(true);
    buscarPorId(id)
      .then((res) => setAcao(res.data.data.acao))
      .catch(() => setErro('Ação não encontrada.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { carregarAcao(); }, [carregarAcao]);

  // Verifica se o voluntário já está inscrito
  useEffect(() => {
    if (!isVoluntario) return;
    minhasAcoes()
      .then((res) => {
        const ids = res.data.data.acoes.map((a) => a.id);
        setJaInscrito(ids.includes(id));
      })
      .catch(() => {});
  }, [id, isVoluntario]);

  const handleExcluir = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta ação?')) return;
    setExcluindo(true);
    try {
      await excluir(id);
      navigate('/');
    } catch {
      alert('Não foi possível excluir a ação.');
      setExcluindo(false);
    }
  };

  const isDono = isOrganizador && acao?.organizador_id === usuario?.id;
  const dataFutura = acao && new Date(acao.data) >= new Date();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">

        {loading && <Spinner label="Carregando ação..." />}
        {erro && <p role="alert" className="text-red-600">{erro}</p>}

        {acao && (
          <article aria-labelledby="acao-titulo">
            {/* Breadcrumb */}
            <nav aria-label="Navegação estrutural" className="mb-4 text-sm text-surface-500">
              <Link to="/" className="hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                Ações
              </Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span aria-current="page">{acao.titulo}</span>
            </nav>

            {/* Header */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant={dataFutura ? 'green' : 'gray'}>
                    {dataFutura ? 'Próxima' : 'Encerrada'}
                  </Badge>
                </div>
                <h1 id="acao-titulo" className="text-2xl font-bold text-surface-900">
                  {acao.titulo}
                </h1>
              </div>

              {isDono && (
                <div className="flex gap-2" role="group" aria-label="Ações do organizador">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/acoes/${id}/editar`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    isLoading={excluindo}
                    onClick={handleExcluir}
                  >
                    Excluir
                  </Button>
                </div>
              )}
            </div>

            {/* Metadados */}
            <dl className="mb-6 grid gap-3 rounded-xl border border-surface-100 bg-surface-50 p-5 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium text-surface-500 uppercase tracking-wide">Data</dt>
                <dd className="mt-1 text-sm font-semibold text-surface-900">{formatarData(acao.data)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-surface-500 uppercase tracking-wide">Local</dt>
                <dd className="mt-1 text-sm font-semibold text-surface-900">{acao.local || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-surface-500 uppercase tracking-wide">Organizador</dt>
                <dd className="mt-1 text-sm font-semibold text-surface-900">{acao.organizador_nome}</dd>
              </div>
            </dl>

            {/* Descrição */}
            {acao.descricao && (
              <section aria-labelledby="desc-heading" className="mb-8">
                <h2 id="desc-heading" className="mb-2 text-sm font-semibold text-surface-700 uppercase tracking-wide">
                  Sobre a ação
                </h2>
                <p className="text-surface-700 leading-relaxed">{acao.descricao}</p>
              </section>
            )}

            {/* Inscrição — voluntário */}
            {isVoluntario && dataFutura && (
              <div className="mb-8 flex flex-col gap-2">
                <ParticipacaoButton
                  acaoId={id}
                  jaInscrito={jaInscrito}
                  onUpdate={() => setJaInscrito((prev) => !prev)}
                />
                {isAutenticado && (
                  // Link para direcionar o usuário à sala de chat específica desta ação
                  <Link
                    to={`/chat/${id}`} // Caminho dinâmico baseado no ID da ação
                    className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:underline
                               focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  >
                    Abrir chat desta ação
                  </Link>
                )}
              </div>
            )}

            {/* Lista de voluntários — organizador */}
            {isDono && (
              <div className="mt-8 border-t border-surface-100 pt-6">
                <AcaoVoluntariosList acaoId={id} />
              </div>
            )}
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AcaoDetailPage;
