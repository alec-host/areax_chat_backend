const mongoose = require("mongoose");
const { mongoDb } = require("../../db/mongo.db");
const { ChatMessageModel } = require("../../mongodb.models");

module.exports.saveChatMessage = async(payload) => {
    try{
        const newChatMessage = new ChatMessageModel(payload);
        const connection = await mongoDb();
        if(!connection){
            console.log('Connection to db has failed');
            return [false,'Connection to db has failed'];            
	}
        const savedChatMessage = await newChatMessage.save();
        return [true,savedChatMessage];
    }catch(err){
        console.error('Error: failed to insert the chat message.',err);
        return [false,'Error: failed to insert the chat message.'];
    }finally{
        mongoose.connection.close();
    }
};
