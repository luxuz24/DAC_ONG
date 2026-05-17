import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Heart, Users, Leaf } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { login, register } from "../services/auth.service";

export default function LoginPage() {
  const { login: loginCtx } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("voluntario");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = isOnboarding 
      ? "Bem-vindo | SGAS" 
      : (isRegistering ? "Criar Conta | SGAS" : "Entrar | SGAS");
  }, [isOnboarding, isRegistering]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await login({ email, senha: password });
      const { token, usuario } = res.data.data;
      loginCtx(token, usuario);
      
      if (usuario.tipo === "organizador") {
        navigate("/painel");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      setError("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register({ nome: name, email, senha: password, tipo: role });
      // Após registro, faz login automático
      const res = await login({ email, senha: password });
      const { token, usuario } = res.data.data;
      loginCtx(token, usuario);
      
      if (usuario.tipo === "organizador") {
        navigate("/painel");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao registrar.");
    } finally {
      setLoading(false);
    }
  };

  const onboardingSlides = [
    {
      icon: <Heart size={48} color="#EA580C" />,
      title: "Conecte-se a causas que importam",
      subtitle: "Encontre ações solidárias próximas de você e faça a diferença na sua comunidade.",
      bg: "linear-gradient(160deg, #fff7ed 0%, #ffedd5 100%)",
    },
    {
      icon: <Users size={48} color="#15803D" />,
      title: "Junte-se a uma rede de voluntários",
      subtitle: "Colabore com centenas de voluntários apaixonados e organizações incríveis.",
      bg: "linear-gradient(160deg, #f0fdf4 0%, #dcfce7 100%)",
    },
    {
      icon: <Leaf size={48} color="#EA580C" />,
      title: "Acompanhe seu impacto",
      subtitle: "Veja em tempo real como suas ações estão transformando vidas ao redor.",
      bg: "linear-gradient(160deg, #fff7ed 0%, #f0fdf4 100%)",
    },
  ];

  if (isOnboarding) {
    const slide = onboardingSlides[onboardingStep];
    return (
      <main
        className="h-screen flex flex-col w-full absolute inset-0 z-50"
        style={{ background: slide.bg, paddingTop: "60px" }}
      >
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
          {/* Slide illustration */}
          <div
            className="w-32 h-32 rounded-3xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.8)",
            }}
          >
            {slide.icon}
          </div>

          <div className="text-center">
            <h1 className="text-2xl mb-3" style={{ color: "var(--text-primary)", fontWeight: 700, lineHeight: 1.3 }}>
              {slide.title}
            </h1>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "0.95rem" }}>
              {slide.subtitle}
            </p>
          </div>

          {/* Dots */}
          <div className="flex gap-2">
            {onboardingSlides.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === onboardingStep ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === onboardingStep ? "#EA580C" : "#D1D5DB",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        <div className="px-6 pb-12 flex flex-col gap-3">
          {onboardingStep < onboardingSlides.length - 1 ? (
            <button
              onClick={() => setOnboardingStep(onboardingStep + 1)}
              className="w-full py-4 rounded-2xl text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-all"
              style={{ background: "linear-gradient(135deg, #EA580C, #F97316)", fontWeight: 600 }}
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={() => {
                setIsOnboarding(false);
                setIsRegistering(true);
              }}
              className="w-full py-4 rounded-2xl text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-all"
              style={{ background: "linear-gradient(135deg, #EA580C, #F97316)", fontWeight: 600 }}
            >
              Começar agora
            </button>
          )}
          <button
            onClick={() => {
              setIsOnboarding(false);
              setIsRegistering(true);
            }}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded"
            style={{ color: "var(--text-secondary)", fontWeight: 500, padding: "8px" }}
          >
            Pular
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(160deg, #1C1C2E 0%, #2D1B4E 40%, #1a2a1a 100%)",
        paddingTop: "60px",
      }}
    >
      {/* Header */}
      <header className="px-8 pt-6 pb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #EA580C, #F97316)" }}
          >
            <Heart size={22} color="white" fill="white" />
          </div>
          <div className="text-left">
            <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.4rem", lineHeight: 1.1 }}>SGAS</h1>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
              GESTÃO SOLIDÁRIA
            </div>
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", lineHeight: 1.5 }}>
          Conectando voluntários a causas que importam
        </p>
      </header>

      {/* Card */}
      <div
        className="mx-4 flex-1 flex flex-col rounded-3xl px-6 py-6"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
          marginBottom: "32px",
        }}
      >
        {isRegistering && (
          <div
            className="flex rounded-2xl p-1 mb-6"
            style={{ background: "rgba(255,255,255,0.08)" }}
            role="group"
            aria-label="Tipo de conta"
          >
            {([
              { id: "voluntario", label: "Voluntário" },
              { id: "organizador", label: "Organizador" },
            ]).map((r) => (
              <button
                key={r.id}
                onClick={() => { setRole(r.id); setError(null); }}
                className="flex-1 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                style={{
                  background: role === r.id ? (r.id === "voluntario" ? "#EA580C" : "#15803D") : "transparent",
                  color: role === r.id ? "white" : "rgba(255,255,255,0.7)",
                  fontWeight: role === r.id ? 600 : 400,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        <h2 className="mb-4" style={{ color: "white", fontWeight: 700, fontSize: "1.3rem" }}>
          {isRegistering 
            ? "Crie sua conta" 
            : "Bem-vindo de volta"
          }
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-4 flex-1">
          {isRegistering && (
            <div>
              <label htmlFor="name-input" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 500 }}>
                Nome completo
              </label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full mt-1.5 px-4 py-3.5 rounded-2xl outline-none transition-colors focus:border-white/40"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "white",
                  fontSize: "0.9rem",
                }}
              />
            </div>
          )}

          <div>
            <label htmlFor="email-input" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 500 }}>
              E-mail
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full mt-1.5 px-4 py-3.5 rounded-2xl outline-none transition-colors focus:border-white/40"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "white",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div>
            <label htmlFor="password-input" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 500 }}>
              Senha
            </label>
            <div className="relative mt-1.5">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-2xl outline-none pr-12 transition-colors focus:border-white/40"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "white",
                  fontSize: "0.9rem",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-colors hover:bg-white/10"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
              >
                {showPassword
                  ? <EyeOff size={18} color="rgba(255,255,255,0.7)" aria-hidden="true" />
                  : <Eye size={18} color="rgba(255,255,255,0.7)" aria-hidden="true" />
                }
              </button>
            </div>
            {!isRegistering && (
              <div className="text-right mt-2">
                <button type="button" style={{ color: role === "voluntario" ? "#F97316" : "#4ADE80", fontSize: "0.8rem", fontWeight: 500 }}>
                  Esqueci minha senha
                </button>
              </div>
            )}
          </div>

          <div className="flex-1" />

          <button
            onClick={isRegistering ? handleRegister : handleLogin}
            disabled={loading}
            className="w-full py-4 rounded-2xl text-white transition-all active:scale-95 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1C2E]"
            style={{
              background: (isRegistering && role === "organizador")
                ? "linear-gradient(135deg, #14532D, #166534)"
                : "linear-gradient(135deg, #9A3412, #C2410C)",
              fontWeight: 700,
              fontSize: "1rem",
              boxShadow: (isRegistering && role === "organizador")
                ? "0 8px 20px rgba(21,128,61,0.35)"
                : "0 8px 20px rgba(234,88,12,0.35)",
            }}
          >
            {loading ? "Aguarde..." : (isRegistering ? "Cadastrar" : "Entrar")}
          </button>

          <div className="flex items-center gap-3 my-1">
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}>ou</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          </div>

          <button
            onClick={() => {
              if (isRegistering) {
                setIsRegistering(false);
              } else {
                setIsOnboarding(true);
              }
              setError(null);
            }}
            className="w-full py-4 rounded-2xl transition-all hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1C2E]"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.8)",
              fontWeight: 500,
              fontSize: "0.9rem",
            }}
          >
            {isRegistering ? "Já tenho uma conta" : "Criar nova conta"}
          </button>
        </div>
      </div>
    </main>
  );
}
