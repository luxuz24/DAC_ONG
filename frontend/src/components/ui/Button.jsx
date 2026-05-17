/**
 * Componente Button acessível.
 *
 * Props:
 *  - variant: 'primary' | 'secondary' | 'danger' | 'ghost'
 *  - size: 'sm' | 'md' | 'lg'
 *  - isLoading: boolean
 *  - ...props: todos os atributos nativos de <button>
 */

const variants = {
  primary:   'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
  secondary: 'bg-surface-200 text-surface-800 hover:bg-surface-300 focus-visible:ring-surface-400',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  ghost:     'bg-transparent text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading && (
        <span className="sr-only">Carregando...</span>
      )}
      {isLoading ? (
        <svg
          aria-hidden="true"
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
