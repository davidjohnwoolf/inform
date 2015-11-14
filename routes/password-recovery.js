'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passwordRecoveryController = require('../controllers/password-recovery-controller');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// request password
router.post('/forgot', passwordRecoveryController.forgot);

// authorize password reset
router.get('/reset/:token', passwordRecoveryController.authorizeReset);

// reset password
router.post('/reset/:token', passwordRecoveryController.reset);

module.exports = router;
