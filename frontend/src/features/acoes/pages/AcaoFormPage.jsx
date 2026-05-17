import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import AcaoForm from '../components/AcaoForm';
import Spinner from '../../../components/ui/Spinner';
import { buscarPorId, criar, atualizar } from '../services/acoes.service';

const AcaoFormPage = () => {
  const { id } = useParams(); // undefined = criação, string = edição
  const navigate = useNavigate();
  const isEdicao = Boolean(id);

  const [acaoInicial, setAcaoInicial] = useState(null);
  const [loading, setLoading] = useState(isEdicao);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!isEdicao) return;
    buscarPorId(id)
      .then((res) => setAcaoInicial(res.data.data.acao))
      .catch(() => setErro('Não foi possível carregar a ação.'))
      .finally(() => setLoading(false));
  }, [id, isEdicao]);

  const handleSubmit = async (dados) => {
    setSaving(true);
    setErro(null);
    try {
      if (isEdicao) {
        await atualizar(id, dados);
        navigate('/painel');
      } else {
        await criar(dados);
        navigate('/painel');
      }
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao salvar a ação.');
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-2xl font-bold text-surface-900">
          {isEdicao ? 'Editar Ação' : 'Nova Ação Solidária'}
        </h1>

        {loading && <Spinner label="Carregando dados da ação..." />}

        {erro && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {erro}
          </p>
        )}

        {!loading && (
          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
            <AcaoForm
              initialData={acaoInicial || {}}
              onSubmit={handleSubmit}
              isLoading={saving}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AcaoFormPage;
