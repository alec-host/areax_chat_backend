const { createClient } = require('redis');
const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();
module.exports = { pubClient, subClient };
