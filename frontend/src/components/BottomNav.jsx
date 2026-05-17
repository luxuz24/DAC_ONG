import { Home, MessageCircle, BarChart2, Settings, ClipboardList } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function BottomNav() {
  const { isOrganizador } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const volunteerTabs = [
    { id: "dashboard", path: "/dashboard", icon: Home, label: "Início" },
    { id: "chat", path: "/chat", icon: MessageCircle, label: "Chat" },
    { id: "settings", path: "/configuracoes", icon: Settings, label: "Config." },
  ];

  const organizerTabs = [
    { id: "organizer", path: "/painel", icon: BarChart2, label: "Painel" },
    { id: "chat", path: "/chat", icon: MessageCircle, label: "Chat" },
    { id: "dashboard", path: "/acoes", icon: ClipboardList, label: "Ações" },
    { id: "settings", path: "/configuracoes", icon: Settings, label: "Config." },
  ];

  const tabs = isOrganizador ? organizerTabs : volunteerTabs;

  return (
    <nav
      aria-label="Navegação principal"
      className="flex items-center justify-around px-2 py-2 fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        paddingBottom: "20px", // Espaço extra para safe area
      }}
    >
      {tabs.map(({ id, path, icon: Icon, label }) => {
        // Considera ativo se a rota atual começa com o path da tab
        const isActive = location.pathname.startsWith(path) || 
                         (path === '/dashboard' && location.pathname === '/');
        const activeColor = isOrganizador ? "#166534" : "#9A3412";
        
        return (
          <button
            key={id}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-current={isActive ? "page" : undefined}
            style={{
              background: isActive ? (isOrganizador ? "rgba(22,101,52,0.1)" : "rgba(154,52,18,0.1)") : "transparent",
              minWidth: "60px",
            }}
          >
            <Icon
              size={22}
              color={isActive ? activeColor : "#4B5563"}
              strokeWidth={isActive ? 2.5 : 1.8}
              aria-hidden="true"
            />
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? activeColor : "#4B5563",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
