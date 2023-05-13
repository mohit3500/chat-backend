const { Router } = require('express');
const { addMessage, getMessage } = require('../controller/messageController');
const router = Router();

router.route('/addMessage').post(addMessage);
router.route('/getMessage').post(getMessage);

module.exports = router;
