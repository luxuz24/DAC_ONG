const { io } = require("socket.io-client");
const { query } = require('./src/config/db');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./src/config/env');

async function test() {
  const user = await query("SELECT id, nome, tipo FROM usuarios LIMIT 1");
  const acao = await query("SELECT id FROM acoes LIMIT 1");
  if (!user.rows[0] || !acao.rows[0]) return console.log("No user or action");
  
  const token = jwt.sign(user.rows[0], jwtSecret, { expiresIn: '1d' });
  const socket = io("http://localhost:3001", { auth: { token } });
  
  socket.on("connect", () => {
    console.log("Connected");
    socket.emit("join_room", { acaoId: acao.rows[0].id });
    socket.emit("send_message", { acaoId: acao.rows[0].id, mensagem: "Socket test message" });
  });

  socket.on("receive_message", (msg) => {
    console.log("Received:", msg);
    process.exit(0);
  });

  socket.on("error", (err) => {
    console.error("Socket Error:", err);
    process.exit(1);
  });
  
  setTimeout(() => {
    console.log("Timeout");
    process.exit(1);
  }, 3000);
}
test();
