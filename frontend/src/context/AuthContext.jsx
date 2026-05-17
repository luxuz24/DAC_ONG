import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const getUsuarioSalvo = () => {
  try {
    return JSON.parse(localStorage.getItem('sgas_usuario')) || null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(getUsuarioSalvo);

  const login = useCallback((token, dadosUsuario) => {
    localStorage.setItem('sgas_token', token);
    localStorage.setItem('sgas_usuario', JSON.stringify(dadosUsuario));
    setUsuario(dadosUsuario);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sgas_token');
    localStorage.removeItem('sgas_usuario');
    setUsuario(null);
  }, []);

  const isAutenticado = Boolean(usuario);
  const isOrganizador = usuario?.tipo === 'organizador';
  const isVoluntario = usuario?.tipo === 'voluntario';

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAutenticado, isOrganizador, isVoluntario }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
