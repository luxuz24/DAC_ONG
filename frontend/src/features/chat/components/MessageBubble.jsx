import { formatarHora } from '../../../utils/formatDate';

/**
 * Bolha de mensagem individual do chat.
 *
 * Props:
 *  - mensagem: { id, mensagem, remetente_nome, enviado_em }
 *  - isMinha: boolean
 */
const MessageBubble = ({ mensagem, isMinha }) => (
  <div
    className={[
      'flex flex-col gap-0.5 max-w-[75%]',
      isMinha ? 'items-end self-end' : 'items-start self-start',
    ].join(' ')}
  >
    {!isMinha && (
      <span className="text-xs font-medium text-surface-500 px-1">
        {mensagem.remetente_nome}
      </span>
    )}

    <div
      className={[
        'rounded-2xl px-4 py-2 text-sm leading-relaxed',
        isMinha
          ? 'bg-primary-600 text-white rounded-tr-sm'
          : 'bg-surface-100 text-surface-900 rounded-tl-sm',
      ].join(' ')}
    >
      {mensagem.mensagem}
    </div>

    <time
      dateTime={mensagem.enviado_em}
      className="text-[11px] text-surface-400 px-1"
    >
      {formatarHora(mensagem.enviado_em)}
    </time>
  </div>
);

export default MessageBubble;
