const mongoose = require("mongoose");
const { mongoDb } = require("../../db/mongo.db");
const { ChatMessageModel } = require("../../mongodb.models");

module.exports.getChatMessages = async(sender,receiver,payload,options={}) => {
    try{
        const connection = await mongoDb();
        if(!connection){
            return null;		
	}
	const {
          limit = 50,
          skip = 0,
	  sortBy = 'created_at',
          sortOrder = 'desc'		
	} = options;
	const query = {
          $or: [
              { sender: sender, receiver: receiver },
	      { sender: receiver, receiver: sender }	  
	  ]

	};    
        const chatMessage = await ChatMessageModel.find(query,/*'sender receiver message media_url created_at'*/).sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }).skip(skip).limit(limit).lean();

	const total = await ChatMessageModel.countDocuments(query);   

        return { chatMessage, total, hasMore: total > (skip + limit) };
    }catch(err){
        console.error('Error: ',err);
        return null;
    }finally{
        mongoose.connection.close();
    }
};
