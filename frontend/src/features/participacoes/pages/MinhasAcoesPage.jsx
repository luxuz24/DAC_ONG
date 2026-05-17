import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Spinner from '../../../components/ui/Spinner';
import Badge from '../../../components/ui/Badge';
import { minhasAcoes } from '../services/participacoes.service';
import { formatarData } from '../../../utils/formatDate';

const MinhasAcoesPage = () => {
  const [acoes, setAcoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    minhasAcoes()
      .then((res) => setAcoes(res.data.data.acoes))
      .catch(() => setErro('Não foi possível carregar suas ações.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="mb-2 text-2xl font-bold text-surface-900">Minhas Ações</h1>
        <p className="mb-8 text-surface-500">Ações solidárias em que você está inscrito.</p>

        {loading && <Spinner label="Carregando suas ações..." />}
        {erro && <p role="alert" className="text-red-600">{erro}</p>}

        {!loading && !erro && acoes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-surface-500 mb-4">Você ainda não está inscrito em nenhuma ação.</p>
            <Link
              to="/"
              className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium
                         text-white hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              Ver ações disponíveis
            </Link>
          </div>
        )}

        {!loading && !erro && acoes.length > 0 && (
          <ul role="list" aria-label="Suas ações inscritas" className="space-y-4">
            {acoes.map((acao) => {
              const dataFutura = new Date(acao.data) >= new Date();
              return (
                <li
                  key={acao.id}
                  className="flex flex-col gap-3 rounded-xl border border-surface-200 bg-white p-5 shadow-sm
                             sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant={dataFutura ? 'green' : 'gray'}>
                        {dataFutura ? 'Próxima' : 'Encerrada'}
                      </Badge>
                    </div>
                    <h2 className="font-semibold text-surface-900">{acao.titulo}</h2>
                    <p className="text-sm text-surface-500">
                      {formatarData(acao.data)} · {acao.local || 'Local não informado'}
                    </p>
                    <p className="text-xs text-surface-400">
                      Organizado por {acao.organizador_nome}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/acoes/${acao.id}`}
                      aria-label={`Ver detalhes de ${acao.titulo}`}
                      className="rounded-lg border border-surface-200 px-3 py-1.5 text-sm text-surface-700
                                 hover:bg-surface-50 focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      Ver detalhes
                    </Link>
                    {/* Link para o chat em tempo real da ação */}
                    <Link
                      to={`/chat/${acao.id}`} // Direciona para a sala de chat pelo ID
                      aria-label={`Chat de ${acao.titulo}`} // Descrição para acessibilidade/leitores de tela
                      className="rounded-lg bg-primary-50 px-3 py-1.5 text-sm text-primary-700
                                 hover:bg-primary-100 focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      Chat
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MinhasAcoesPage;
