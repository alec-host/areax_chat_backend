const express = require('express');
const auth = require("../middleware/auth");
const { upload } = require("../middleware/file.handle.upload");

const chatListController = require('../controllers/chat.list.controller');
const chatMessageController = require('../controllers/chat.controller');

const router = express.Router();

router.post('/send',auth,upload.single('file'),chatMessageController.SendMessage);
router.get('/messages',auth,chatMessageController.GetChatHistory);
router.put('/read',auth,chatMessageController.MarkAsRead);
router.put('/:message_id/edit',auth,chatMessageController.EditMessage);
router.delete('/:message_id/delete',auth,chatMessageController.DeleteMessage);
router.get('/chat-list',auth,chatListController.chatlist);

module.exports = router;
