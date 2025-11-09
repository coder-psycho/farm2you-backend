const express = require('express');
const router = express.Router();
const sendMessage = require('../controllers/chat/send-message');


router.route('/send-message').post(sendMessage)


module.exports = router;