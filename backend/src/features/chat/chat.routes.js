const { Router } = require('express');
const { sendSuccess } = require('../../shared/response');
const chatService = require('./chat.service');
const authMiddleware = require('../../middleware/auth.middleware');

const router = Router();

// Todas as rotas do chat requerem autenticação
router.use(authMiddleware);

// GET /api/chat/:acaoId/historico
router.get('/:acaoId/historico', async (req, res, next) => {
  try {
    const historico = await chatService.buscarHistorico(req.params.acaoId);
    sendSuccess(res, { historico });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
