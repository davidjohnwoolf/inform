'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');
var User = require('../models/user');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// user authorization helper
function requireUser(req, res, next) {
  if (req.session.user === req.params.id) {
    next();
  } else {
    res.json({ fail: true, authorizeFail: true, message: 'Not Authorized' });
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

      res.json({ message: 'Successfully created source' });
    });
  });
});

// edit
router.get('/:id/feeds/:feedId/sources/:sourceId/edit', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    res.json({
      message: 'Successfully recieved source info',
      user: {
  id: user._id,
  email: user._email,
  feeds: user.feeds,
  defaultFeed: user.defaultFeed
},
      data: user.feeds.id(req.params.feedId).sources.id(req.params.sourceId)
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

      res.json({ message: 'Successfully updated source' });
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

      res.json({ message: 'Successfully deleted source' });
    });
  });
});

module.exports = router;
