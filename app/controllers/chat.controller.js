const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("./user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("./user/find.user.count.by.reference.no");

const { uploadImageToCustomStorage } = require("../services/CUSTOM-STORAGE");

const { saveChatMessage } = require("./user/save.chat.message.mongo");
const { getChatMessages } = require("./user/get.chat.message.mongo");
const { markMessagesAsRead } = require("./user/mark.message.read");
const { editMessage } = require("./user/edit.message"); 
const { deleteMessage } = require("./user/delete.message");
const { syncChatListMessage } = require("./user/chat.list.mongo");

module.exports.SendMessage = async(req,res) => {
    const { email, reference_number, sender, receiver, message } = req.body;   
    const file = req.file ? req.file : null;
    const errors = validationResult(req);	
    if(!errors.isEmpty()){
       return res.status(422).json({ success: false, error: true, message: errors.array() });	    
    }
    try{

       let media_url;
       if(file){
          media_url = await uploadImageToCustomStorage(file?.filename);
       }else{
          media_url = null;
       }

       const email_found = await findUserCountByEmail(email);
       if(email_found === 0){
          res.status(404).json({
              success: false,
              error: true,
              message: "Email not found."
          });
	  return;
       }

       const reference_number_found = await findUserCountByReferenceNumber(reference_number);
       if(reference_number_found === 0){
          res.status(404).json({
              success: false,
              error: true,
              message: "Reference number not found."
          });
	  return;     
       }

       if(reference_number !== sender) {
          res.status(403).json({
              success: false,
              error: true,
              message: 'Unauthorized sender.'
          });
	  return;     
       }
	  
       if(typeof message !== 'string' || message.trim().length === 0 || message.length > 1000) {
          res.status(400).json({
              success: false,
              error: true,
              message: 'Invalid message content.'
          });
	  return;     
       }
	    	    
       const timestamp = new Date().toISOString(); 
       const payload = { sender, receiver, message, media_url, timestamp };    
       const [ok,response] = await saveChatMessage(payload);
       if(!ok){
          res.status(400).json({
             success: false,
             error: true,
             message: response
          });
	  return;	   
       }    
 
       //-.sync chat list.
       const responseSync = await syncChatListMessage(sender, receiver, message);

       res.status(200).json({
           success: true,
           error: false,
	   data: {
	      message_id: response?._id,
              sender: response?.sender,
              receiver: response?.receiver,
              message: response?.message,
              media_url: response?.media_url,
              is_read: response?.is_read,
              is_edited: response?.is_edited,
              is_deleted: response?.is_deleted,
              created_at: response?.created_at,
              updated_at: response?.updated_at,
              edit_history: response?.edit_history,		   
	   },
	   message_id: response?._id || null,
           message: "Message posted."
       });   
    }catch(e){
       res.status(500).json({
           success: false,
           error: true,
           message: e?.response?.message || e?.message || 'Something wrong has happened'
       });
    }
};

const groupMessagesByDate = (messages) => {
  const grouped = {};
  messages.forEach(msg => {
    const dateKey = new Date(msg.created_at).toDateString();
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(msg);
  });
  return grouped;
}

module.exports.GetChatHistory = async(req,res) => {
    const { email, reference_number, sender, receiver, limit, skip } = req.query;
    const errors = validationResult(req);	
    if(!errors.isEmpty()){
       return res.status(422).json({ success: false, error: true, message: errors.array() });	    
    }
    try{
       const limit = 100;
       const skip = 0;	   
       const sortBy = 'timestamp';
       const sortOrder = 'asc';	    
       const email_found = await findUserCountByEmail(email);
       if(email_found === 0){  	
          res.status(404).json({
              success: false,
              error: true,
              message: "Email not found."
          });
	  return;     
       }
       const reference_number_found = await findUserCountByReferenceNumber(reference_number);
       if(reference_number_found === 0){
          res.status(404).json({
              success: false,
              error: true,
              message: "Reference number not found."
          });
	  return;
       }

       const { chatMessage = [], total, hasMore } = await getChatMessages(sender, receiver,{ limit: parseInt(limit), skip: parseInt(skip), sortBy, sortOrder });
       
       const formattedMessages = Array.isArray(chatMessage) ?
             chatMessage.map(msg => ({
	       ...msg,
               bubble_position: msg.sender === sender ? 'right' : 'left',
	       is_media: !!msg.media_url,
	       is_unread: req.query.lastReadTimestamp ? new Date(msg.created_at) > new Date(req.query.lastReadTimestamp) : false     
	     })) : [];

       const groupedMessages = groupMessagesByDate(formattedMessages);

       res.status(200).json({
           success: true,
	   error: false,
	   data: /*formattedMessages || []*/ groupedMessages,	
	   total,
	   hasMore,    
	   message: "Chat message list."		
       });          
    }catch(e){
       res.status(500).json({
           success: false,
           error: true,
           message: e?.response?.message || e?.message || 'Something wrong has happened'
       });
    }
};

module.exports.MarkAsRead = async(req,res) => {
    const { email, reference_number, sender, receiver } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(422).json({ success: false, error: true, message: errors.array() });
    }
    try{
       const email_found = await findUserCountByEmail(email);
       if(email_found === 0){
          res.status(404).json({
              success: false,
              error: true,
              message: "Email not found."
          });
          return;
       }
       const reference_number_found = await findUserCountByReferenceNumber(reference_number);
       if(reference_number_found === 0){
          res.status(404).json({
              success: false,
              error: true,
              message: "Reference number not found."
          });
          return;
       }	    
       const response = await markMessagesAsRead(sender, receiver);
       if(!response){
          res.status(400).json({
              success: false,
              error: true,
              message: "Failed to update messages."
          });
          return;
       }	
       res.status(200).json({
          success: true,
          error: false,
          message: "Messages have been updated."
       });
    }catch(e){
       res.status(500).json({
           success: false,
           error: true,
           message: e?.response?.message || e?.message || 'Something wrong has happened'
       });
    }
};

module.exports.EditMessage = async(req,res) => {
    const { email, reference_number, message } = req.body;
    const { message_id } = req.params;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(422).json({ success: false, error: true, message: errors.array() });
    }
    try{
       const email_found = await findUserCountByEmail(email);
       if(email_found === 0){
          res.status(404).json({
              success: false,
              error: true,
              message: "Email not found."
          });
          return;
       }
       const reference_number_found = await findUserCountByReferenceNumber(reference_number);
       if(reference_number_found === 0){
          res.status(404).json({
              success: false,
              error: true,
              message: "Reference number not found."
          });
          return;
       }	    
       const response = await editMessage(message_id,reference_number,message);	    
       if(!response[0]){
          res.status(400).json({
              success: false,
              error: true,
              message: response[1]
          });
          return;
       }
       res.status(200).json({
          success: true,
          error: false,
          message: response[1]
       });
    }catch(e){
       res.status(500).json({
           success: false,
           error: true,
           message: e?.response?.message || e?.message || 'Something wrong has happened'
       });
    }
};

module.exports.DeleteMessage = async(req,res) => {
    const { email, reference_number } = req.body;
    const { message_id } = req.params;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(422).json({ success: false, error: true, message: errors.array() });
    }
    try{
       const email_found = await findUserCountByEmail(email);
       if(email_found === 0){
          res.status(404).json({
              success: false,
              error: true,
              message: "Email not found."
          });
          return;
       }
       const reference_number_found = await findUserCountByReferenceNumber(reference_number);
       if(reference_number_found === 0){
          res.status(404).json({
              success: false,
              error: true,
              message: "Reference number not found."
          });
          return;
       }
       const response = await deleteMessage(message_id,reference_number);
       if(!response[0]){
          res.status(400).json({
              success: false,
              error: true,
              message: response[1]
          });
          return;
       }
       res.status(200).json({
          success: true,
          error: false,
          message: response[1]
       });
    }catch(e){
       res.status(500).json({
           success: false,
           error: true,
           message: e?.response?.message || e?.message || 'Something wrong has happened'
       });
    }
};

