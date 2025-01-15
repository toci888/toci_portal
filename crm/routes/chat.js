const express = require('express');
const router = express.Router();
const { sendToChatGPT } = require('../controllers/chatController');

router.post('/generate', sendToChatGPT);

module.exports = router;
