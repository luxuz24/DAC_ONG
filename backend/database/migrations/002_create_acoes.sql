CREATE TABLE IF NOT EXISTS acoes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo          VARCHAR(200) NOT NULL,
  descricao       TEXT,
  data            DATE         NOT NULL,
  local           VARCHAR(200),
  organizador_id  UUID         NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  criado_em       TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_acoes_organizador ON acoes(organizador_id);
CREATE INDEX IF NOT EXISTS idx_acoes_data ON acoes(data);
