import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

/**
 * Formulário de criação/edição de ação solidária.
 *
 * Props:
 *  - initialData: objeto com dados para edição (opcional)
 *  - onSubmit: (dados) => Promise<void>
 *  - isLoading: boolean
 */
const AcaoForm = ({ initialData = {}, onSubmit, isLoading = false }) => {
  const [form, setForm] = useState({
    titulo:    initialData.titulo    || '',
    descricao: initialData.descricao || '',
    data:      initialData.data      ? initialData.data.slice(0, 10) : '',
    local:     initialData.local     || '',
    vagas:     initialData.vagas     || 20,
    categoria: initialData.categoria || 'Geral',
    cor:       initialData.cor       || '#EA580C',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.titulo.trim())    errs.titulo = 'Título é obrigatório.';
    if (!form.data)             errs.data   = 'Data é obrigatória.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Formulário de ação solidária">
      <fieldset className="space-y-4" disabled={isLoading}>
        <legend className="sr-only">Dados da ação solidária</legend>

        <Input
          id="acao-titulo"
          name="titulo"
          label="Título"
          placeholder="Ex: Doação de Alimentos no Centro"
          value={form.titulo}
          onChange={handleChange}
          error={errors.titulo}
          required
          maxLength={200}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="acao-descricao" className="text-sm font-medium text-surface-700">
            Descrição
          </label>
          <textarea
            id="acao-descricao"
            name="descricao"
            rows={4}
            placeholder="Descreva o objetivo e atividades da ação..."
            value={form.descricao}
            onChange={handleChange}
            maxLength={2000}
            className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-surface-900
                       placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500
                       focus:border-transparent hover:border-surface-300 resize-none"
          />
        </div>

        <Input
          id="acao-data"
          name="data"
          type="date"
          label="Data"
          value={form.data}
          onChange={handleChange}
          error={errors.data}
          required
          min={new Date().toISOString().slice(0, 10)}
        />

        <Input
          id="acao-local"
          name="local"
          label="Local"
          placeholder="Ex: Praça Central, Centro"
          value={form.local}
          onChange={handleChange}
          maxLength={200}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="acao-vagas"
            name="vagas"
            type="number"
            label="Total de Vagas"
            value={form.vagas}
            onChange={handleChange}
            min={1}
            max={10000}
            required
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="acao-categoria" className="text-sm font-medium text-surface-700 dark:text-surface-300">
              Categoria
            </label>
            <select
              id="acao-categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-surface-900 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500 h-[42px]"
            >
              <option value="Geral">Geral</option>
              <option value="Educação">Educação</option>
              <option value="Saúde">Saúde</option>
              <option value="Distribuição">Distribuição</option>
              <option value="Meio Ambiente">Meio Ambiente</option>
              <option value="Visita">Visita</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
            Cor de Destaque
          </label>
          <div className="flex items-center gap-3">
            {['#EA580C', '#15803D', '#3B82F6', '#8B5CF6', '#EAB308'].map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, cor: color }))}
                className={`w-8 h-8 rounded-full transition-all ${form.cor === color ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : ''}`}
                style={{ background: color }}
              />
            ))}
          </div>
        </div>
      </fieldset>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="submit" isLoading={isLoading}>
          {initialData.id ? 'Salvar alterações' : 'Criar ação'}
        </Button>
      </div>
    </form>
  );
};

export default AcaoForm;
