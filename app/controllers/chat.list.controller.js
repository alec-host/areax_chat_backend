const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("./user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("./user/find.user.count.by.reference.no");
const { getChatList } = require("./user/chat.list.mongo");

class DirectMessage {
   async chatlist(req,res){
      const { email,reference_number } = req.query;
      const errors = validationResult(req);
      if(!errors.isEmpty()){
         return res.status(422).json({ success: false, error: true, message: errors.array() });
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
      const [ok,response] = await getChatList(reference_number);  
     
      if(!ok){
         res.status(400).json({
             success: false,
             error: true,
             message: "No"
         });
         return;
      }	   
      res.status(200).json({
          success: true,
	  data: response,    
          error: false,
          message: "Chat List"
      });
      
   };
};

module.exports = new DirectMessage();
