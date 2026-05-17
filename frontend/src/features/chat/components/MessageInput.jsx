import { useState } from 'react';

/**
 * Input de mensagem do chat com envio por Enter.
 *
 * Props:
 *  - onEnviar: (texto: string) => void
 */
const MessageInput = ({ onEnviar }) => {
  const [texto, setTexto] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = texto.trim();
    if (!trimmed) return;
    onEnviar(trimmed);
    setTexto('');
  };

  const handleKeyDown = (e) => {
    // Enter sem Shift envia; Shift+Enter quebra linha
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Enviar mensagem"
      className="border-t border-surface-100 px-4 py-3 flex items-end gap-2"
    >
      <label htmlFor="chat-input" className="sr-only">
        Digite sua mensagem
      </label>
      <textarea
        id="chat-input"
        rows={1}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite uma mensagem... (Enter para enviar)"
        maxLength={1000}
        className="flex-1 resize-none rounded-xl border border-surface-200 bg-surface-50 px-3 py-2
                   text-sm text-surface-900 placeholder:text-surface-400
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      <button
        type="submit"
        disabled={!texto.trim()}
        aria-label="Enviar mensagem"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white
                   transition-colors hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;
