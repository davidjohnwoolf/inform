'use strict';

var express = require('express');
var router = express.Router();
var Feed = require('../models/feed');

router.get('/', function(req, res) {
  res.render('feeds/index', { title: 'Feeds' });
});

module.exports = router;
