const mongoose = require("mongoose");
const { mongoDb } = require("../../db/mongo.db");
const { ChatMessageModel } = require("../../mongodb.models");

module.exports.deleteMessage = async(messageId,sender) => {
  try {
      const connection = await mongoDb();
      if(!connection){
         return null;
      }
      const message = await  ChatMessageModel.findById(messageId);
      if(!message){
         return [false, 'No message found'];
      }	  
      if(message.sender !== sender){
         return [false, 'Not authorised to edit this message']; 
      }	  
      if(message.is_deleted === 1){
         return [false, 'Cannot edit deleted message'];
      }
      message.is_deleted = 1;
      message.message = 'This message was deleted';
      await message.save();
      return [true,'Posted successfully'];
  } catch (error) {
      console.error('Error failed to delete the message:', error);
      return [false,'Failed to delete the message'];
  }
};
