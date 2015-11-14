'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var usersController = require('../controllers/users-controller');
var applicationHelper = require('../helpers/application-helper');
var requireUser = applicationHelper.requireUser

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// create
router.post('/new', usersController.create);

// show
router.get('/:id', requireUser, usersController.show);

// update
router.put('/:id/edit', requireUser, usersController.update);

// destroy
router.delete('/:id', requireUser, usersController.destroy);

module.exports = router;
