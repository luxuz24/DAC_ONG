import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Rota protegida por autenticação e opcionalmente por role.
 *
 * @param {string} [role] - Role exigida: 'voluntario' | 'organizador'
 * @param {string} [redirectTo='/login'] - Para onde redirecionar se não autorizado
 */
const ProtectedRoute = ({ role, redirectTo = '/login' }) => {
  const { isAutenticado, usuario } = useAuth();

  if (!isAutenticado) {
    return <Navigate to={redirectTo} replace />;
  }

  if (role && usuario?.tipo !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
