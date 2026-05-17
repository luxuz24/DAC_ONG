CREATE TABLE curtidas (
  acao_id UUID REFERENCES acoes(id) ON DELETE CASCADE,
  voluntario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (acao_id, voluntario_id)
);
