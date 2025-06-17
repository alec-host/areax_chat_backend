const mongoose = require("mongoose");
const { mongoDb } = require("../../db/mongo.db");
const { ChatMessageModel } = require("../../mongodb.models");

module.exports.editMessage = async(messageId,sender,newContent) => {
  try {
      const connection = await mongoDb();
      if(!connection){
         return [false,'connection has failed'];
      }
      const messageIn = await ChatMessageModel.findById(messageId);
      if(!messageIn){
         return [false, 'No message found'];
      }
      	  
      if(messageIn.sender !== sender){
         return [false, 'Not authorised to edit this message'];
      }

      console.log(messageIn.is_deleted);	  
      
      if(messageIn.is_deleted === 1){
         return [false, 'Cannot edit deleted message'];
      }
	
      messageIn.edit_history.push({
         message: messageIn.message,
         edited_at: messageIn.updated_at
      });

      messageIn.message = newContent;
      messageIn.is_edited = 1;
      await messageIn.save();

      return [true,messageIn];
  } catch (error) {
      console.error('Error: failed to edit the message:', error);
      return [false,'Failed to edit the message'];
  }
};
