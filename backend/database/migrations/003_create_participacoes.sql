CREATE TABLE IF NOT EXISTS participacoes (
  id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  UUID      NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  acao_id     UUID      NOT NULL REFERENCES acoes(id) ON DELETE CASCADE,
  inscrito_em TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(usuario_id, acao_id)
);

CREATE INDEX IF NOT EXISTS idx_participacoes_usuario ON participacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_participacoes_acao ON participacoes(acao_id);
