import { Link } from 'react-router-dom';
import { formatarData } from '../../../utils/formatDate';
import Badge from '../../../components/ui/Badge';

/**
 * Card de ação solidária para listagem.
 *
 * Props:
 *  - acao: { id, titulo, descricao, data, local, organizador_nome }
 */
const AcaoCard = ({ acao }) => {
  const dataFutura = new Date(acao.data) >= new Date();

  return (
    <article
      aria-label={`Ação: ${acao.titulo}`}
      className="flex flex-col rounded-2xl border border-surface-200 bg-white p-5 shadow-sm
                 transition-shadow duration-200 hover:shadow-md"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-surface-900 leading-snug">
          {acao.titulo}
        </h2>
        <Badge variant={dataFutura ? 'green' : 'gray'}>
          {dataFutura ? 'Próxima' : 'Encerrada'}
        </Badge>
      </div>

      {/* Descrição */}
      {acao.descricao && (
        <p className="mb-4 text-sm text-surface-600 line-clamp-2">
          {acao.descricao}
        </p>
      )}

      {/* Metadados */}
      <dl className="mt-auto space-y-1 text-sm text-surface-500">
        <div className="flex items-center gap-1.5">
          <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <dt className="sr-only">Data</dt>
          <dd>{formatarData(acao.data)}</dd>
        </div>

        {acao.local && (
          <div className="flex items-center gap-1.5">
            <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <dt className="sr-only">Local</dt>
            <dd>{acao.local}</dd>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <dt className="sr-only">Organizador</dt>
          <dd>{acao.organizador_nome}</dd>
        </div>
      </dl>

      {/* CTA */}
      <Link
        to={`/acoes/${acao.id}`}
        aria-label={`Ver detalhes de ${acao.titulo}`}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2
                   text-sm font-medium text-white transition-colors hover:bg-primary-700
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        Ver detalhes
      </Link>
    </article>
  );
};

export default AcaoCard;
