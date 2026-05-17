import { useState, useEffect } from "react";
import {
  ChevronRight, LogOut, Moon, Sun, Accessibility,
  Type, Contrast, Bell, Shield, HelpCircle,
  User, Globe, Check
} from "lucide-react";
import { BottomNav } from "../../../components/BottomNav";
import { useAuth } from "../../../hooks/useAuth";

function Toggle({ checked, onChange, color = "#EA580C", "aria-label": ariaLabel }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 rounded-full"
      aria-label={ariaLabel}
      aria-checked={checked}
      role="switch"
      tabIndex={0}
      style={{
        width: "50px",
        height: "28px",
        borderRadius: "14px",
        background: checked ? color : "#D1D5DB",
        transition: "background 0.2s",
        border: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "25px" : "3px",
          width: "22px",
          height: "22px",
          borderRadius: "11px",
          background: "var(--bg-card)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { usuario, logout, isOrganizador } = useAuth();
  
  // States persistentes via localStorage
  const [fontSize, setFontSize] = useState(
    () => Number(localStorage.getItem('sgas_font_size')) || 16
  );
  const [highContrast, setHighContrast] = useState(
    () => localStorage.getItem('sgas_high_contrast') === 'true'
  );
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('sgas_dark_mode') === 'true'
  );
  const [reduceMotion, setReduceMotion] = useState(
    () => localStorage.getItem('sgas_reduce_motion') === 'true'
  );


  useEffect(() => {
    document.title = "Configurações | SGAS";
  }, []);

  // Aplica tamanho de fonte no body e salva no localstorage
  useEffect(() => {
    localStorage.setItem('sgas_font_size', fontSize.toString());
    document.documentElement.style.fontSize = `${fontSize}px`;
    
    // Fallback: apply directly on the container below too if needed
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('sgas_high_contrast', highContrast.toString());
    if (highContrast) {
      document.body.style.filter = "contrast(1.2)";
    } else {
      document.body.style.filter = "none";
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('sgas_dark_mode', darkMode.toString());
    // Se for adicionar tailwind dark mode (classe 'dark' no html)
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('sgas_reduce_motion', reduceMotion.toString());
  }, [reduceMotion]);


  const firstName = usuario?.nome?.split(" ")[0] || "Usuário";
  const accentColor = isOrganizador ? "#15803D" : "#EA580C";



  return (
    <div className="flex flex-col min-h-screen bg-surface-50 dark:bg-surface-950" style={{ paddingBottom: "80px" }}>
      {/* Header */}
      <header
        className="pt-14 px-5 pb-6"
        style={{
          background: `linear-gradient(160deg, #1C1C2E 0%, #2D1B4E 100%)`,
          borderBottomLeftRadius: "28px",
          borderBottomRightRadius: "28px",
        }}
      >
        <h1 style={{ color: "white", fontWeight: 700, fontSize: "1.3rem", marginBottom: "16px" }}>
          Configurações
        </h1>

        {/* Profile card */}
        <div
          className="flex items-center gap-4 p-4 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}BB)`,
              fontWeight: 700, color: "white", fontSize: "1.2rem",
            }}
          >
            {firstName[0]}
          </div>
          <div className="flex-1">
            <h2 style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>{usuario?.nome}</h2>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>
              {!isOrganizador ? "Voluntário · Nível Ouro" : "Organizador Principal"}
            </div>
            {!isOrganizador && (
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{ width: "8px", height: "8px", borderRadius: "2px", background: i < 4 ? accentColor : "rgba(255,255,255,0.3)" }} />
                ))}
              </div>
            )}
          </div>
          <ChevronRight size={18} color="rgba(255,255,255,0.7)" aria-hidden="true" />
        </div>
      </header>

      <main className="flex-1 px-5 pt-5 flex flex-col gap-4 pb-4">

        {/* Accessibility section */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "var(--bg-card)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border-color)" }}
        >
          {/* Section header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: "1px solid var(--border-color)" }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "#F0F9FF" }}
            >
              <Accessibility size={16} color="#0891B2" />
            </div>
            <span className="text-surface-900 dark:text-surface-50" style={{ fontWeight: 700, fontSize: "0.9rem" }}>Acessibilidade</span>
          </div>

          {/* Font size */}
          <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
            <div className="flex items-center gap-3 mb-3">
              <Type size={18} color={accentColor} />
              <div className="flex-1">
                <div className="text-surface-900 dark:text-surface-50" style={{ fontWeight: 600, fontSize: "0.9rem" }}>Tamanho da fonte global</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Atual: {fontSize}px</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", width: "28px" }}>A</span>
              <div
                className="flex-1 h-1.5 rounded-full relative cursor-pointer"
                style={{ background: "#E5E7EB" }}
              >
                <div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{
                    width: `${((fontSize - 12) / (24 - 12)) * 100}%`,
                    background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
                    transition: "width 0.2s",
                  }}
                />
                <input
                  type="range"
                  min={12}
                  max={24}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer focus-visible:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  aria-label="Ajustar tamanho da fonte"
                  style={{ height: "100%" }}
                />
              </div>
              <span style={{ color: "var(--text-primary)", fontSize: "1rem", width: "28px", textAlign: "right", fontWeight: 700 }}>A</span>
            </div>
            <div className="flex justify-between mt-2 px-1">
              {[12, 14, 16, 18, 20, 22, 24].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className="w-7 h-7 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  aria-label={`Tamanho da fonte ${size}`}
                  aria-pressed={fontSize === size}
                  style={{
                    background: fontSize === size ? accentColor : "#F3F4F6",
                    color: fontSize === size ? "white" : "#9CA3AF",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                  }}
                >
                  {size === 12 ? "P" : size === 16 ? "M" : size === 20 ? "G" : size === 24 ? "XG" : ""}
                  {![12, 16, 20, 24].includes(size) && (
                    fontSize === size ? <Check size={10} /> : ""
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* High contrast */}
          <div className="px-4 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-color)" }}>
            <div className="flex items-center gap-3">
              <Contrast size={18} color={accentColor} />
              <div>
                <div className="text-surface-900 dark:text-surface-50" style={{ fontWeight: 600, fontSize: "0.9rem" }}>Alto contraste</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>Melhora legibilidade WCAG AA+</div>
              </div>
            </div>
            <Toggle checked={highContrast} onChange={setHighContrast} color={accentColor} aria-label="Ativar Alto contraste" />
          </div>

          {/* Dark mode */}
          <div className="px-4 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-color)" }}>
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={18} color={accentColor} /> : <Sun size={18} color={accentColor} />}
              <div>
                <div className="text-surface-900 dark:text-surface-50" style={{ fontWeight: 600, fontSize: "0.9rem" }}>Modo escuro</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>Reduz fadiga ocular à noite</div>
              </div>
            </div>
            <Toggle checked={darkMode} onChange={setDarkMode} color={accentColor} aria-label="Ativar Modo escuro" />
          </div>

          {/* Reduce motion */}
          <div className="px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", border: `2px solid ${accentColor}` }}></div>
              </div>
              <div>
                <div className="text-surface-900 dark:text-surface-50" style={{ fontWeight: 600, fontSize: "0.9rem" }}>Reduzir movimento</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>Para sensibilidade vestibular</div>
              </div>
            </div>
            <Toggle checked={reduceMotion} onChange={setReduceMotion} color={accentColor} aria-label="Ativar Reduzir animações" />
          </div>
        </div>




        {/* Help */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "var(--bg-card)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border-color)" }}
        >
          <button className="w-full px-4 py-3.5 flex items-center gap-3 focus:outline-none focus:bg-white/5" style={{ borderBottom: "1px solid var(--border-color)" }} aria-label="Acessar Central de Ajuda">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#F0FDF4" }}>
              <HelpCircle size={16} color="#15803D" aria-hidden="true" />
            </div>
            <span className="text-surface-900 dark:text-surface-50" style={{ fontWeight: 500, fontSize: "0.9rem", flex: 1, textAlign: "left" }}>Central de Ajuda</span>
            <ChevronRight size={16} color="#D1D5DB" aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className="w-full px-4 py-3.5 flex items-center gap-3 focus:outline-none focus:bg-white/5"
            aria-label="Sair da conta"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#FEF2F2" }}>
              <LogOut size={16} color="#EF4444" aria-hidden="true" />
            </div>
            <span style={{ color: "#EF4444", fontWeight: 600, fontSize: "0.9rem", flex: 1, textAlign: "left" }}>Sair da conta</span>
          </button>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", textAlign: "center" }}>
          SGAS v1.0.0 · Gestão de Ações Solidárias
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
