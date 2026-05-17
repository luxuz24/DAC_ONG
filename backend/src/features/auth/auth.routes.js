const { Router } = require('express');
const authController = require('./auth.controller');
const validateMiddleware = require('../../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('./auth.schema');

const router = Router();

// POST /api/auth/register
router.post('/register', validateMiddleware(registerSchema), authController.register);

// POST /api/auth/login
router.post('/login', validateMiddleware(loginSchema), authController.login);

module.exports = router;
