'use strict';

var express = require('express');
var router = express.Router();
var Feed = require('../models/feed');

router.get('/', function(req, res) {
  res.send('Feeds');
});

module.exports = router;
