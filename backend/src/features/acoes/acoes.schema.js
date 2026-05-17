const Joi = require('joi');

const acaoSchema = Joi.object({
  titulo: Joi.string().min(3).max(200).required().messages({
    'any.required': 'Título é obrigatório.',
  }),
  descricao: Joi.string().max(2000).optional().allow(''),
  data: Joi.date().iso().required().messages({
    'any.required': 'Data é obrigatória.',
    'date.format': 'Data deve estar no formato YYYY-MM-DD.',
  }),
  local: Joi.string().max(200).optional().allow(''),
  vagas: Joi.number().integer().min(1).max(10000).optional(),
  categoria: Joi.string().max(100).optional(),
  cor: Joi.string().max(20).optional(),
});

module.exports = { acaoSchema };
