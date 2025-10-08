const { pubClient } = require('../rcache/redis');
const { sendFCMWithRetry } = require('../utils/fcm');
const { logDelivery } = require('../controllers/logging/logger');
const { handleReceipts } = require('./RECEIPTS');
const { handlePresence } = require('./PRESENCE');
const { flushOfflineQueue } = require('./QUEUE');

function handleConnection(io, socket) {
  const userId = socket.handshake.query.userId;
  const tenantId = socket.handshake.query.tenantId || 'default';
  const room = `tenant:${tenantId}:user:${userId}`;

  if (!userId) return socket.disconnect(true);

  socket.join(room);
  handlePresence(io, userId, tenantId, 'online');
  flushOfflineQueue(io, tenantId, userId);

  socket.on('private-message', async ({ toUserId, payload }) => {
    const targetRoom = `tenant:${tenantId}:user:${toUserId}`;
    const statusKey = `${tenantId}:${toUserId}`;
    const isOnline = await pubClient.hGet('socketStatus', statusKey) === 'online';
    console.log('TTTTTTTTTTTTTTTTTTTTTTT ',isOnline);
    console.log('RRRRRRRRRRRRRRRRRRRRRRR ',toUserId);
    console.log('VVVVVVVVVVVVVVVVVVVVVVVVV ',payload);	  
    if (isOnline) {
      io.to(targetRoom).emit('private-message', { from: userId, payload });
      logDelivery({ from: userId, to: toUserId, method: 'WebSocket', status: 'delivered' });
    } else {
      //-.pass message to fcm api.	    
      await sendFCMWithRetry(toUserId, payload);
    }
  });

  handleReceipts(io, socket, tenantId);
  socket.on('disconnect', () => handlePresence(io, userId, tenantId, 'offline'));
}

module.exports = { handleConnection };
