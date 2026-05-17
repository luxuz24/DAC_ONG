import { useState } from 'react';
import { inscrever, cancelar } from '../services/participacoes.service';
import Button from '../../../components/ui/Button';

/**
 * Botão de inscrição/cancelamento em uma ação.
 *
 * Props:
 *  - acaoId: string
 *  - jaInscrito: boolean
 *  - onUpdate: () => void — callback após mudança de estado
 */
const ParticipacaoButton = ({ acaoId, jaInscrito, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInscrever = async () => {
    setLoading(true);
    setError(null);
    try {
      await inscrever(acaoId);
      onUpdate?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao se inscrever.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async () => {
    setLoading(true);
    setError(null);
    try {
      await cancelar(acaoId);
      onUpdate?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cancelar inscrição.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <p role="alert" className="mb-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {jaInscrito ? (
        <Button
          variant="danger"
          isLoading={loading}
          onClick={handleCancelar}
          aria-label="Cancelar inscrição nesta ação"
        >
          Cancelar inscrição
        </Button>
      ) : (
        <Button
          isLoading={loading}
          onClick={handleInscrever}
          aria-label="Inscrever-se nesta ação"
        >
          Inscrever-se
        </Button>
      )}
    </div>
  );
};

export default ParticipacaoButton;
