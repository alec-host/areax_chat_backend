const express = require('express');
const auth = require("../middleware/auth");
const { upload } =require("../middleware/file.handle.upload");

const chatMessageController = require('../controllers/chat.controller');

const router = express.Router();

router.post('/send',upload.single('file'),chatMessageController.SendMessage);
router.get('/messages',chatMessageController.GetChatHistory);
router.put('/read',chatMessageController.MarkAsRead);
router.put('/:message_id/edit',chatMessageController.EditMessage);
router.delete('/:message_id/delete',chatMessageController.DeleteMessage);

module.exports = router;
