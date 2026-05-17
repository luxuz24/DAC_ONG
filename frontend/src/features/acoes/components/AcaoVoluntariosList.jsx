import { useEffect, useState } from 'react';
import { listarVoluntarios } from '../services/acoes.service';
import Spinner from '../../../components/ui/Spinner';
import { formatarData } from '../../../utils/formatDate';

/**
 * Lista de voluntários inscritos em uma ação (visível apenas para organizador).
 *
 * Props:
 *  - acaoId: string
 */
const AcaoVoluntariosList = ({ acaoId }) => {
  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    listarVoluntarios(acaoId)
      .then((res) => setVoluntarios(res.data.data.voluntarios))
      .catch(() => setError('Não foi possível carregar os voluntários.'))
      .finally(() => setLoading(false));
  }, [acaoId]);

  if (loading) return <Spinner label="Carregando voluntários..." />;
  if (error)   return <p role="alert" className="text-sm text-red-600">{error}</p>;

  return (
    <section aria-labelledby="voluntarios-heading">
      <h3 id="voluntarios-heading" className="mb-3 text-sm font-semibold text-surface-700 uppercase tracking-wide">
        Voluntários inscritos ({voluntarios.length})
      </h3>

      {voluntarios.length === 0 ? (
        <p className="text-sm text-surface-500">Nenhum voluntário inscrito ainda.</p>
      ) : (
        <ul role="list" className="divide-y divide-surface-100">
          {voluntarios.map((v) => (
            <li key={v.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-surface-900">{v.nome}</p>
                <p className="text-xs text-surface-500">{v.email}</p>
              </div>
              <time
                dateTime={v.inscrito_em}
                className="text-xs text-surface-400"
                title={`Inscrito em ${formatarData(v.inscrito_em)}`}
              >
                {formatarData(v.inscrito_em)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AcaoVoluntariosList;
