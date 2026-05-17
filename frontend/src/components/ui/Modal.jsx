import { useEffect, useRef } from 'react';

/**
 * Modal acessível com trap de foco e fechamento por Escape.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - title: string
 *  - children: ReactNode
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef(null);

  // Fecha ao pressionar Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Foca o dialog ao abrir
  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-100 px-6 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-surface-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="rounded-lg p-1 text-surface-400 hover:bg-surface-100 hover:text-surface-700 focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
