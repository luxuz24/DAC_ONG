import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Páginas públicas
import AcoesListPage from '../features/acoes/pages/AcoesListPage';
import AcaoDetailPage from '../features/acoes/pages/AcaoDetailPage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';

// Páginas protegidas — organizador
import AcaoFormPage from '../features/acoes/pages/AcaoFormPage';
import OrganizerPanelPage from '../features/acoes/pages/OrganizerPanelPage';
import VoluntarioProfilePage from '../features/acoes/pages/VoluntarioProfilePage';

// Páginas protegidas — voluntário
import MinhasAcoesPage from '../features/participacoes/pages/MinhasAcoesPage';

// Páginas protegidas — autenticado
import ChatPage from '../features/chat/pages/ChatPage';
import SettingsPage from '../features/settings/pages/SettingsPage';

const RootRedirect = () => {
  const { isAutenticado, isOrganizador } = useAuth();
  if (!isAutenticado) return <Navigate to="/login" replace />;
  if (isOrganizador) return <Navigate to="/painel" replace />;
  return <Navigate to="/dashboard" replace />;
};

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Rota inicial */}
      <Route path="/" element={<RootRedirect />} />

      {/* Rotas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas protegidas — organizador */}
      <Route element={<ProtectedRoute role="organizador" />}>
        <Route path="/painel" element={<OrganizerPanelPage />} />
        <Route path="/acoes" element={<AcoesListPage />} />
        <Route path="/acoes/nova" element={<AcaoFormPage />} />
        <Route path="/acoes/:id/editar" element={<AcaoFormPage />} />
        <Route path="/voluntario/:id" element={<VoluntarioProfilePage />} />
      </Route>

      {/* Rotas protegidas — voluntário */}
      <Route element={<ProtectedRoute role="voluntario" />}>
        <Route path="/dashboard" element={<AcoesListPage />} />
        <Route path="/minhas-acoes" element={<MinhasAcoesPage />} />
      </Route>

      {/* Rotas protegidas — qualquer autenticado */}
      <Route element={<ProtectedRoute />}>
        <Route path="/configuracoes" element={<SettingsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:acaoId" element={<ChatPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
