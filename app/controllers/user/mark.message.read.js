const mongoose = require("mongoose");
const { mongoDb } = require("../../db/mongo.db");
const { ChatMessageModel } = require("../../mongodb.models");

module.exports.markMessagesAsRead = async(sender, receiver) => {
  try {
      const connection = await mongoDb();
      if(!connection){
         return false;
      }
      	  
      await ChatMessageModel.updateMany(
         {
             sender: receiver,
             receiver: sender,
             is_read: 0
         },
	 {
             $set: { is_read: 1 }
         }
      );
      return true;	  
  } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
  }
};
