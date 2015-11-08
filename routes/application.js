'use strict';

var express = require('express');
var router = express.Router();

// get static page
router.get('/', function(req, res) {
  res.sendFile('public/main.html', { root: __dirname + '/../' });
});

module.exports = router;
