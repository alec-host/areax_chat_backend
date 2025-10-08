// server.js
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { pubClient, subClient } = require('./rcache/redis');
const { handleConnection } = require('./services/DELIVERY');
const { APP_CHAT_SERVER_PORT } = require("./constants/app_constants");

const httpServer = createServer();
const io = new Server(httpServer, {
  path: '/socket.io2',	
  cors: {
    origin: ['*'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['polling', 'websocket'] // <-- include polling	
});

(async () => {
  await pubClient.connect();
  await subClient.connect();
  io.adapter(createAdapter(pubClient, subClient));
  console.log('Redis adapter connected');
})();

io.on('connection', socket => handleConnection(io, socket));

process.on('SIGINT', async () => {
  await pubClient.quit();
  await subClient.quit();
  httpServer.close(() => process.exit(0));
});

httpServer.listen(APP_CHAT_SERVER_PORT, () => {
  console.log(`Socket.IO server running on port ${APP_CHAT_SERVER_PORT}`);
});
