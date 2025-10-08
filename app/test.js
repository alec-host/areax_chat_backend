const io = require('socket.io-client');

// Connect to the server
const socket = io('http://localhost:9133', {
  path: '/socket.io2',
  transports: ['websocket'],
  query: {
    userId: 'alex',
    tenantId: 'school-42'
  }
});

// On successful connection
socket.on('connect', () => {
  console.log('✅ Connected to server');

  // Notify server that user is online
  socket.emit('user_online', {
    userId: 'alex',
    tenantId: 'school-42'
  });

  // Send a private message
  socket.emit('private-message', {
    toUserId: 'user123',
    payload: {
      sender: 'alex',
      message: 'Hello from Node.js client!',
      messageId: 'msg-001'
    }
  });

  // Simulate typing
  socket.emit('user_typing', {
    toUserId: 'user123',
    userId: 'alex'
  });

  // Stop typing after 2 seconds
  setTimeout(() => {
    socket.emit('user_stop_typing', {
      toUserId: 'user123',
      userId: 'alex'
    });
  }, 2000);
});

// Listen for delivery confirmation
socket.on('message_delivered', data => {
  console.log('📬 Message delivered:', data);
});

// Listen for read receipt
socket.on('message_read_receipt', data => {
  console.log('👀 Message read:', data);
});

// Listen for typing indicator
socket.on('user_typing', data => {
  console.log(`✍️ ${data.userId} is typing...`);
});

socket.on('user_stop_typing', data => {
  console.log(`🛑 ${data.userId} stopped typing.`);
});

// Listen for presence updates
socket.on('user_online', data => {
  console.log(`🟢 ${data.userId} is online`);
});

socket.on('user_offline', data => {
  console.log(`🔴 ${data.userId} went offline`);
});

// Handle disconnect
socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');

  // Notify server that user is offline
  socket.emit('user_offline', {
    userId: 'alex',
    tenantId: 'school-42'
  });
});
