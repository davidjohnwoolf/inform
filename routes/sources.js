'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var sourcesController = require('../controllers/sources-controller');
var applicationHelper = require('../helpers/application-helper');
var requireUser = applicationHelper.requireUser;

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// create
router.post('/:id/feeds/:feedId/sources/new', requireUser, sourcesController.create);

// edit
router.get('/:id/feeds/:feedId/sources/:sourceId/edit', requireUser, sourcesController.edit);

// update
router.put('/:id/feeds/:feedId/sources/:sourceId/edit', requireUser, sourcesController.update);

// destroy
router.delete('/:id/feeds/:feedId/sources/:sourceId', requireUser, sourcesController.destroy);

module.exports = router;
