// models/MessageDeliveryLog.js
const mongoose = require('mongoose');

const MessageDeliveryLogSchema = new mongoose.Schema({
  message_id: {
    type: String,
    required: true,
    index: true
  },
  receiver_id: {
    type: String,
    required: true,
    index: true
  },
  delivery_channel: {
    type: String,
    enum: ['websocket', 'fcm', 'redis'],
    default: 'websocket'
  },
  status: {
    type: String,
    enum: ['delivered', 'failed', 'queued', 'expired'],
    required: true
  },
  failure_reason: {
    type: String,
    default: null
  },
  attempted_at: {
    type: Date,
    default: Date.now
  },
  expires_at: {
    type: Date,
    default: null
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },	
}, {
  timestamps: false, // Adds createdAt and updatedAt
  collection: 'tbl_message_delivery_logs'
});

const ChatMessageDeliveryModel = mongoose.model('MessageDeliveryLog', MessageDeliveryLogSchema);

module.exports = ChatMessageDeliveryModel;
