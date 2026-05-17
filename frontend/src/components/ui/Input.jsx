/**
 * Componente Input acessível — sempre requer um label associado via htmlFor/id.
 *
 * Props:
 *  - id: string (obrigatório para acessibilidade)
 *  - label: string (texto visível do label)
 *  - error: string (mensagem de erro)
 *  - ...props: atributos nativos de <input>
 */
const Input = ({ id, label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-surface-700"
        >
          {label}
          {props.required && (
            <span aria-hidden="true" className="text-red-600 ml-1">*</span>
          )}
        </label>
      )}
      <input
        id={id}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? 'true' : undefined}
        className={[
          'w-full rounded-lg border px-3 py-2 text-surface-900',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'placeholder:text-surface-400',
          error
            ? 'border-red-500 bg-red-50'
            : 'border-surface-200 bg-white hover:border-surface-300',
          className,
        ].join(' ')}
        {...props}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
