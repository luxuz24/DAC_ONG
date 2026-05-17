const Joi = require('joi');

const updateUsuarioSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Nome deve ter ao menos 2 caracteres.',
    'any.required': 'Nome é obrigatório.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido.',
    'any.required': 'Email é obrigatório.',
  }),
});

module.exports = { updateUsuarioSchema };
