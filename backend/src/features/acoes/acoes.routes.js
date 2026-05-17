const { Router } = require('express');
const acoesController = require('./acoes.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const roleMiddleware = require('../../middleware/role.middleware');
const validateMiddleware = require('../../middleware/validate.middleware');
const { acaoSchema } = require('./acoes.schema');

const router = Router();

// GET /api/acoes — público
router.get('/', acoesController.listar);

// GET /api/acoes/curtidas/minhas — apenas voluntário
router.get(
  '/curtidas/minhas',
  authMiddleware,
  roleMiddleware('voluntario'),
  acoesController.listarCurtidas
);

// GET /api/acoes/:id — público
router.get('/:id', acoesController.buscarPorId);

// POST /api/acoes/:id/curtir — apenas voluntário
router.post(
  '/:id/curtir',
  authMiddleware,
  roleMiddleware('voluntario'),
  acoesController.toggleCurtida
);

// GET /api/acoes/atividades/recentes — apenas organizador
router.get(
  '/atividades/recentes',
  authMiddleware,
  roleMiddleware('organizador'),
  acoesController.listarAtividades
);

// POST /api/acoes — apenas organizador
router.post(
  '/',
  authMiddleware,
  roleMiddleware('organizador'),
  validateMiddleware(acaoSchema),
  acoesController.criar
);

// PUT /api/acoes/:id — apenas organizador dono
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('organizador'),
  validateMiddleware(acaoSchema),
  acoesController.atualizar
);

// DELETE /api/acoes/:id — apenas organizador dono
router.delete('/:id', authMiddleware, roleMiddleware('organizador'), acoesController.excluir);

// GET /api/acoes/:id/voluntarios — apenas organizador dono
router.get(
  '/:id/voluntarios',
  authMiddleware,
  roleMiddleware('organizador'),
  acoesController.listarVoluntarios
);

module.exports = router;
