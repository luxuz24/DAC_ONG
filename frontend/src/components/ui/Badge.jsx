/**
 * Badge de status/tipo com contraste adequado (WCAG AA).
 *
 * Props:
 *  - variant: 'green' | 'blue' | 'yellow' | 'red' | 'gray'
 *  - children: ReactNode
 */
const variants = {
  green:  'bg-green-100  text-green-800',
  blue:   'bg-blue-100   text-blue-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red:    'bg-red-100    text-red-800',
  gray:   'bg-surface-100 text-surface-700',
};

const Badge = ({ children, variant = 'gray' }) => (
  <span
    className={[
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variants[variant],
    ].join(' ')}
  >
    {children}
  </span>
);

export default Badge;
