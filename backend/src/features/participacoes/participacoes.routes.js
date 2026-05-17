const { Router } = require('express');
const participacoesController = require('./participacoes.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const roleMiddleware = require('../../middleware/role.middleware');

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// POST /api/participacoes/acoes/:acaoId/inscrever — apenas voluntário
router.post(
  '/acoes/:acaoId/inscrever',
  roleMiddleware('voluntario'),
  participacoesController.inscrever
);

// DELETE /api/participacoes/acoes/:acaoId/cancelar — apenas voluntário
router.delete(
  '/acoes/:acaoId/cancelar',
  roleMiddleware('voluntario'),
  participacoesController.cancelar
);

// GET /api/participacoes/minhas — voluntário vê suas ações
router.get('/minhas', roleMiddleware('voluntario'), participacoesController.minhasAcoes);

// GET /api/participacoes/minhas/stats — voluntário vê seus stats
router.get('/minhas/stats', roleMiddleware('voluntario'), participacoesController.minhasStats);

module.exports = router;
