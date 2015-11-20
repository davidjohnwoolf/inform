'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var feedsController = require('../controllers/feeds-controller');
var applicationHelper = require('../helpers/application-helper');
var requireUser = applicationHelper.requireUser;

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// index
router.get('/:id/feeds', requireUser, feedsController.index);

// create
router.post('/:id/feeds/new', requireUser, feedsController.create);

// edit
router.get('/:id/feeds/:feedId/edit', requireUser, feedsController.edit);

// update
router.put('/:id/feeds/:feedId/edit', requireUser, feedsController.update);

// show
router.get('/:id/feeds/:feedId', requireUser, feedsController.show);

// search
router.get('/:id/feeds/:feedId/:q', requireUser, feedsController.search);

// destroy
router.delete('/:id/feeds/:feedId', requireUser, feedsController.destroy);

module.exports = router;
