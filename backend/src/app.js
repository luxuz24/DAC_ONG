const express = require('express');
const cors = require('cors');
const { clientUrl } = require('./config/env');

// Rotas das features
const authRoutes = require('./features/auth/auth.routes');
const usuariosRoutes = require('./features/usuarios/usuarios.routes');
const acoesRoutes = require('./features/acoes/acoes.routes');
const participacoesRoutes = require('./features/participacoes/participacoes.routes');
const chatRoutes = require('./features/chat/chat.routes');

// Middleware de erro (deve ser o último)
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// ── Middlewares globais ──────────────────────────────────────────────────
app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json());

// ── Rotas ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/acoes', acoesRoutes);
app.use('/api/participacoes', participacoesRoutes);
app.use('/api/chat', chatRoutes);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Rota não encontrada.' });
});

// ── Handler global de erros ──────────────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
