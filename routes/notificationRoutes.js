const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.post('/welcome', notificationController.sendWelcome);
router.post('/password-reset', notificationController.sendPasswordReset);

module.exports = router;
