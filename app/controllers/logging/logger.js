const mongoose = require("mongoose");
const { mongoDb } = require("../../db/mongo.db");
const { ChatMessageDeliveryModel } = require('../../mongodb.models');

function logDelivery({ from, to, method, status }) {
  console.log(`[${new Date().toISOString()}] ${method} delivery from ${from} to ${to}: ${status}`);
}

async function logDeliveryFailure({ messageId, receiverId, reason, channel = 'fcm' }) {
  try{
    const connection = await mongoDb();
    if(!connection){
       console.log('Connection to db has failed');
       return [false,'Connection to db has failed'];
    }
    const payload = {
       message_id: messageId,
       receiver_id: receiverId,
       delivery_channel: channel,
       status: 'failed',
       failure_reason: reason,
       attempted_at: new Date(),
       expires_at: new Date(Date.now() + 86400000) // 24h TTL
    };	  
    const messageDeliveryLog = new ChatMessageDeliveryModel(payload);	  
    const savedMessageDeliveryLog = await messageDeliveryLog.save(); 	  
    return [true,savedMessageDeliveryLog];	  
  }catch(err){
     console.error(`MongoDB log failure error: ${err.message}`);
  }finally{
     mongoose.connection.close();
  }
}

module.exports = { logDelivery, logDeliveryFailure };
