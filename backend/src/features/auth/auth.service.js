const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../../config/db');
const AppError = require('../../shared/AppError');
const { jwtSecret, jwtExpiresIn } = require('../../config/env');

/**
 * Registra um novo usuário (voluntário ou organizador).
 */
const register = async ({ nome, email, senha, tipo }) => {
  // Verifica se email já existe
  const existe = await query('SELECT id FROM usuarios WHERE email = $1', [email]);
  if (existe.rows.length > 0) {
    throw new AppError('Email já cadastrado.', 409);
  }

  const senhaHash = await bcrypt.hash(senha, 12);

  const result = await query(
    `INSERT INTO usuarios (nome, email, senha_hash, tipo)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nome, email, tipo, criado_em`,
    [nome, email, senhaHash, tipo]
  );

  return result.rows[0];
};

/**
 * Autentica um usuário e retorna o JWT.
 */
const login = async ({ email, senha }) => {
  const result = await query(
    'SELECT id, nome, email, senha_hash, tipo FROM usuarios WHERE email = $1',
    [email]
  );

  const usuario = result.rows[0];

  if (!usuario) {
    throw new AppError('Email ou senha incorretos.', 401);
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaValida) {
    throw new AppError('Email ou senha incorretos.', 401);
  }

  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
    },
  };
};

module.exports = { register, login };
