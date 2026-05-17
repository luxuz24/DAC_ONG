-- Habilita extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS usuarios (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  UNIQUE NOT NULL,
  senha_hash VARCHAR(255)  NOT NULL,
  tipo       VARCHAR(20)   NOT NULL CHECK (tipo IN ('voluntario', 'organizador')),
  criado_em  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
