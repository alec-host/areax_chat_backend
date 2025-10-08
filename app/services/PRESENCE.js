const { pubClient } = require('../rcache/redis');

function handlePresence(io, userId, tenantId, status) {
  const key = `${tenantId}:${userId}`;
  pubClient.hSet('socketStatus', key, status);
  io.emit('user_presence', { userId, status });
}

module.exports = { handlePresence };
