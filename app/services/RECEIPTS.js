function handleReceipts(io, socket, tenantId) {
  socket.on('typing', ({ sender, receiver }) => {
    io.to(`tenant:${tenantId}:user:${receiver}`).emit('typing', { sender, isTyping: true });
  });

  socket.on('stop_typing', ({ sender, receiver }) => {
    io.to(`tenant:${tenantId}:user:${receiver}`).emit('typing', { sender, isTyping: false });
  });

  socket.on('message_received', ({ messageId, receiver }) => {
    io.to(`tenant:${tenantId}:user:${receiver}`).emit('message_delivered', { messageId });
  });

  socket.on('message_read', ({ messageId, readerId }) => {
    io.to(`tenant:${tenantId}:user:${readerId}`).emit('message_read_receipt', {
      messageId,
      readerId,
      readAt: new Date().toISOString()
    });
  });
}

module.exports = { handleReceipts };
