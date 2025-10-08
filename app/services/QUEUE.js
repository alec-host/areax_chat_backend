const { pubClient } = require('../rcache/redis');

async function flushOfflineQueue(io, tenantId, userId) {
  const queueKey = `offline_queue:${tenantId}:${userId}`;
  const messages = await pubClient.lRange(queueKey, 0, -1);
  messages.forEach(msg => {
    io.to(`tenant:${tenantId}:user:${userId}`).emit('new_message', JSON.parse(msg));
  });
  await pubClient.del(queueKey);
}

module.exports = { flushOfflineQueue };
