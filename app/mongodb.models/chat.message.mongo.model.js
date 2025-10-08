const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
   sender: { type: String, ref: "User-A", required: true },
   receiver: { type: String, ref: "User-B", required: true },
   message: { type: String, required: true },
   media_url: { type: String, required: false },	
   created_at: { type: Date, default: Date.now },
   updated_at: { type: Date, default: Date.now },
   is_read: { type: Number, default: 0 },	
   is_edited: { type: Number, default: 0 },
   is_deleted: { type: Number, default: 0 },
   edit_history: [{
      message: String,
      edited_at: Date
   }],	
});

chatMessageSchema.index({ sender: 1, receiver: 1 });
chatMessageSchema.index({ created_at: -1 });
chatMessageSchema.index({ is_deleted: 1 });

/**
 * Virtual field: bubble_position
 * Usage: message.bubble_position(currentUserId)
 */
chatMessageSchema.methods.bubble_position = function (currentUserId) {
  return this.sender === currentUserId ? 'right' : 'left';
};

const ChatMessageModel = mongoose.model("tbl_chat_message", chatMessageSchema);

module.exports = ChatMessageModel;
