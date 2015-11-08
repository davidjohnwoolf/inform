'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');
var User = require('../models/user');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));

// user authorization helper
function requireUser(req, res, next) {
  if (req.session.user && (req.session.user.id === req.params.id)) {
    next();
  } else {
    res.send({ success: false, message: 'Not authorized' });
  }
}

// create
router.post('/:id/feeds/:feedId/sources/new', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    user.feeds.id(req.params.feedId).sources.push({
      name: req.body.name,
      type: req.body.type,
      value: req.body.value
    });

    user.save(function(err) {
      if (err) res.send(err);

      res.send({ success: true, message: 'Successfully created source' });
    });
  });
});

// update
router.put('/:id/feeds/:feedId/sources/:sourceId/edit', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    for (var key in req.body) {
      user.feeds.id(req.params.feedId).sources.id(req.params.sourceId)[key] = req.body[key];
    }

    user.save(function(err) {
      if (err) res.send(err);

      res.send({ success: true, message: 'Successfully updated source' });
    });
  });
});

// destroy
router.delete('/:id/feeds/:feedId/sources/:sourceId', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    user.feeds.id(req.params.feedId).sources.id(req.params.sourceId).remove();

    user.save(function(err) {
      if (err) res.send(err);

      res.send({ success: true, message: 'Successfully deleted source' });
    });
  });
});

module.exports = router;
