-- Seed de desenvolvimento — dados de exemplo
-- Senhas: todos usam "senha123" (hash bcrypt gerado com custo 12)

INSERT INTO usuarios (nome, email, senha_hash, tipo) VALUES
  ('Ana Organizadora', 'ana@ong.com', '$2a$12$oBmQBoYIJ999H26IysPCZ.mJh9lwzqS3tx00TzxhZ5RaDkW4iijIS', 'organizador'),
  ('Bruno Voluntário', 'bruno@email.com', '$2a$12$oBmQBoYIJ999H26IysPCZ.mJh9lwzqS3tx00TzxhZ5RaDkW4iijIS', 'voluntario'),
  ('Carla Voluntária', 'carla@email.com', '$2a$12$oBmQBoYIJ999H26IysPCZ.mJh9lwzqS3tx00TzxhZ5RaDkW4iijIS', 'voluntario')
ON CONFLICT (email) DO NOTHING;

-- Ações (referencia o organizador pelo email)
INSERT INTO acoes (titulo, descricao, data, local, organizador_id)
SELECT
  'Doação de Alimentos no Centro',
  'Arrecadação e distribuição de cestas básicas para famílias em vulnerabilidade.',
  CURRENT_DATE + INTERVAL '7 days',
  'Praça Central, Centro',
  id
FROM usuarios WHERE email = 'ana@ong.com'
ON CONFLICT DO NOTHING;

INSERT INTO acoes (titulo, descricao, data, local, organizador_id)
SELECT
  'Aula de Reforço Escolar',
  'Voluntários ajudam crianças com dificuldades em matemática e português.',
  CURRENT_DATE + INTERVAL '14 days',
  'Escola Municipal Esperança',
  id
FROM usuarios WHERE email = 'ana@ong.com'
ON CONFLICT DO NOTHING;
