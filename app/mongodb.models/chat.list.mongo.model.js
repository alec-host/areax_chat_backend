const mongoose = require('mongoose');
const { Schema } = mongoose;

// Embedded receiver profile for quick access
const ReceiverSchema = new Schema({
  receiver_reference_number: { type: String, ref: 'User', required: true },
  name: { type: String, required: true },
  profile_image: { type: String }, // URL to avatar
}, { _id: false });

// Chat preview metadata
const ChatPreviewSchema = new Schema({
  last_message: { type: String },
  last_message_at: { type: Date },
  unread_count: { type: Number, default: 0 },
}, { _id: false });

// Main DM Chat List schema
const ChatListSchema = new Schema({
  sender_reference_number: { type: String, ref: 'User', required: true }, // the user viewing this list
  receiver: { type: ReceiverSchema, required: true },
  chat_preview: { type: ChatPreviewSchema },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, {
  timestamps: false,
  collection: 'tbl_chat_lists'
});

const ChatListModel = mongoose.model('ChatList', ChatListSchema);

module.exports = ChatListModel;
