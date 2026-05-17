const Joi = require('joi');

const registerSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Nome deve ter ao menos 2 caracteres.',
    'any.required': 'Nome é obrigatório.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido.',
    'any.required': 'Email é obrigatório.',
  }),
  senha: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter ao menos 6 caracteres.',
    'any.required': 'Senha é obrigatória.',
  }),
  tipo: Joi.string().valid('voluntario', 'organizador').required().messages({
    'any.only': 'Tipo deve ser "voluntario" ou "organizador".',
    'any.required': 'Tipo é obrigatório.',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido.',
    'any.required': 'Email é obrigatório.',
  }),
  senha: Joi.string().required().messages({
    'any.required': 'Senha é obrigatória.',
  }),
});

module.exports = { registerSchema, loginSchema };
