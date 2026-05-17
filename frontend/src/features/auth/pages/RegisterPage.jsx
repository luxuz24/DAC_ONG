import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ nome: '', email: '', senha: '', tipo: 'voluntario' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [erroGeral, setErroGeral] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.nome.trim())          errs.nome  = 'Nome é obrigatório.';
    if (!form.email)                errs.email = 'Email é obrigatório.';
    if (form.senha.length < 6)      errs.senha = 'Senha deve ter ao menos 6 caracteres.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErroGeral(null);
    try {
      await register(form);
      navigate('/login', { state: { mensagem: 'Cadastro realizado! Faça login para continuar.' } });
    } catch (err) {
      setErroGeral(err.response?.data?.message || 'Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">Criar conta</h1>
          <p className="mt-1 text-sm text-surface-500">
            Junte-se ao SGAS e faça parte das ações solidárias.
          </p>
        </div>

        <div className="rounded-2xl border border-surface-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} noValidate aria-label="Formulário de cadastro">
            <fieldset className="space-y-4" disabled={loading}>
              <legend className="sr-only">Dados do novo usuário</legend>

              {erroGeral && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {erroGeral}
                </p>
              )}

              <Input
                id="reg-nome"
                name="nome"
                label="Nome completo"
                placeholder="Ana Silva"
                value={form.nome}
                onChange={handleChange}
                error={errors.nome}
                required
                autoComplete="name"
              />

              <Input
                id="reg-email"
                name="email"
                type="email"
                label="Email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                required
                autoComplete="email"
              />

              <Input
                id="reg-senha"
                name="senha"
                type="password"
                label="Senha"
                placeholder="Mínimo 6 caracteres"
                value={form.senha}
                onChange={handleChange}
                error={errors.senha}
                required
                autoComplete="new-password"
              />

              {/* Tipo de usuário — grupo de radio acessível */}
              <fieldset>
                <legend className="text-sm font-medium text-surface-700 mb-2">
                  Tipo de conta <span aria-hidden="true" className="text-red-600">*</span>
                </legend>
                <div className="flex gap-6">
                  {[
                    { value: 'voluntario',  label: 'Voluntário' },
                    { value: 'organizador', label: 'Organizador' },
                  ].map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tipo"
                        value={value}
                        checked={form.tipo === value}
                        onChange={handleChange}
                        className="h-4 w-4 accent-primary-600 focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm text-surface-700">{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </fieldset>

            <Button type="submit" isLoading={loading} className="mt-6 w-full">
              Criar conta
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-surface-500">
            Já tem conta?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:underline focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
