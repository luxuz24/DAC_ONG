const { Router } = require('express');
const usuariosController = require('./usuarios.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const validateMiddleware = require('../../middleware/validate.middleware');
const { updateUsuarioSchema } = require('./usuarios.schema');
const roleMiddleware = require('../../middleware/role.middleware');

const router = Router();

// Todas as rotas de usuários requerem autenticação
router.use(authMiddleware);

// GET /api/usuarios/me
router.get('/me', usuariosController.getMe);

// PUT /api/usuarios/me
router.put('/me', validateMiddleware(updateUsuarioSchema), usuariosController.updateMe);

// GET /api/usuarios/:id/perfil-voluntario
router.get('/:id/perfil-voluntario', roleMiddleware('organizador'), usuariosController.getPerfilVoluntario);

// GET /api/usuarios/voluntarios
router.get('/voluntarios', roleMiddleware('organizador'), usuariosController.listarVoluntarios);

module.exports = router;
