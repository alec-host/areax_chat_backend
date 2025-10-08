const mongoose = require("mongoose");
const { mongoDb } = require("../../db/mongo.db");
const { ChatListModel } = require("../../mongodb.models");
const { getUserDetailByReferenceNumber } = require("./get.user.details");

module.exports.getChatList = async(reference_number) => {
    try{
        const connection = await mongoDb();
        if(!connection){
           return null;
        }
        
        const chatList = await ChatListModel.find({ sender_reference_number: reference_number })
	  .sort({ 'chat_preview.last_message_at' : -1 })
	  .select('receiver.name receiver.receiver_reference_number receiver.profile_image chat_preview.last_message chat_preview.last_message_at chat_preview.unread_count')    
	  .lean();

        return [true,chatList];
    }catch(err){
        console.error('Error: ',err);
        return [false, err.message];
    }finally{
        mongoose.connection.close();
    }
};

module.exports.syncChatListMessage = async(sender,receiver,content) => {
    try{
        const connection = await mongoDb();
        if(!connection){
            return null;
        }

	const now = new Date();

        // Update sender's chat list
        await upsertChatList(sender, receiver, content, now, false);

        // Update receiver's chat list
        await upsertChatList(receiver, sender, content, now, true);

        return [true,'chat list synced'];
    }catch(err){
        console.error('Error: ',err);
        return [false, err.message];
    }finally{
        mongoose.connection.close();
    }
};

// Helper to upsert chat list entry
async function upsertChatList(sender_reference_number,receiver_reference_number,last_message,last_message_at,increment_unread) {
  const peer = await getUserDetailByReferenceNumber(receiver_reference_number);
  console.log('USER DATA', peer);	
  await ChatListModel.findOneAndUpdate(
    { sender_reference_number, 'receiver.receiver_reference_number': receiver_reference_number },
    {
      $set: {	 
        receiver: {
           receiver_reference_number: receiver_reference_number,
           name: peer?.display_name,
           profile_image: peer?.profile_picture_url
        },
        chat_preview: {
           last_message,
           last_message_at,
           unread_count: increment_unread ? 1 : 0
        },
        updated_at: new Date()
      }
    },
    { upsert: true, new: true }
  );
};
