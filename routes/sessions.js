'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var sessionsController = require('../controllers/sessions-controller');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// login
router.post('/login', sessionsController.login);

// logout
router.get('/logout', sessionsController.logout);

module.exports = router;
