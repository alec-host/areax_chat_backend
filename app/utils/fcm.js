const admin = require('firebase-admin');
const { logDeliveryFailure } = require('../controllers/logging/logger');
const { pubClient } = require('../rcache/redis');

async function sendFCMWithRetry(receiverId, payload, attempt = 1) {
  try {
    const token = await getDeviceToken(receiverId); // Implement this
    await admin.messaging().send({
      token,
      notification: {
        title: `New message from ${payload.sender}`,
        body: payload.message
      },
      data: { ...payload }
    });
  } catch (err) {
    if (attempt < 3) {
      setTimeout(() => sendFCMWithRetry(receiverId, payload, attempt + 1), 1000 * attempt);
    } else {
      await pubClient.hSet(`fcm_failures:${receiverId}`, payload.messageId, err.message);
      await logDeliveryFailure({
        messageId: payload.messageId,
        receiverId,
        reason: err.message
      });
    }
  }
}

module.exports = { sendFCMWithRetry };
