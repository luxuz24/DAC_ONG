CREATE TABLE IF NOT EXISTS chat_mensagens (
  id            UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  mensagem      TEXT      NOT NULL,
  remetente_id  UUID      REFERENCES usuarios(id) ON DELETE SET NULL,
  acao_id       UUID      NOT NULL REFERENCES acoes(id) ON DELETE CASCADE,
  enviado_em    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_acao ON chat_mensagens(acao_id);
CREATE INDEX IF NOT EXISTS idx_chat_enviado_em ON chat_mensagens(enviado_em);
