import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const Navbar = () => {
  const { isAutenticado, isOrganizador, isVoluntario, usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/90 backdrop-blur-sm">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6"
      >
        {/* Logo */}
        <Link
          to="/"
          aria-label="SGAS — Página inicial"
          className="flex items-center gap-2 rounded-lg focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm"
          >
            S
          </span>
          <span className="font-semibold text-surface-900 hidden sm:block">
            SGAS
          </span>
        </Link>

        {/* Links centrais */}
        <ul className="flex items-center gap-1" role="list">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900',
                ].join(' ')
              }
            >
              Ações
            </NavLink>
          </li>

          {isVoluntario && (
            <li>
              <NavLink
                to="/minhas-acoes"
                className={({ isActive }) =>
                  [
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900',
                  ].join(' ')
                }
              >
                Minhas Ações
              </NavLink>
            </li>
          )}

          {isOrganizador && (
            <li>
              <NavLink
                to="/acoes/nova"
                className={({ isActive }) =>
                  [
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900',
                  ].join(' ')
                }
              >
                Nova Ação
              </NavLink>
            </li>
          )}
        </ul>

        {/* Ações do usuário */}
        <div className="flex items-center gap-2">
          {isAutenticado ? (
            <>
              <span
                className="hidden text-sm text-surface-600 sm:block"
                aria-label={`Logado como ${usuario.nome}`}
              >
                Olá, <strong>{usuario.nome.split(' ')[0]}</strong>
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Cadastrar
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
