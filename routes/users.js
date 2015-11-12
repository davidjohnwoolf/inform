'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
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
router.post('/new', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) res.send(err);

    if (!user) {

      if (req.body.password === req.body.confirmation) {
        if (req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
          var user = new User({
            email: req.body.email,
            password: req.body.password,
            feeds: []
          });

          user.save(function(err) {
            if (err) res.send(err);

            res.json({ message: 'Successfully created user' });
          });
        } else {
          res.json({ fail: true, message: 'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, and one number' });
        }
      } else {
        // if password and password confirmation do not match
        res.json({ fail: true, message: 'Passwords must match' });
      }

    } else {
      // if email already in use
      res.json({ fail: true, message: 'There is already an account with that email' });
    }
  });
});

// show
router.get('/:id', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    res.json({
      message: 'Successfully retrieved user',
      data: {
        id: user._id,
        email: user.email,
        feeds: user.feeds,
        defaultFeed: user.defaultFeed
      }
    });
  });
});

// update
router.put('/:id/edit', requireUser, function(req, res) {
  if (req.body.password !== req.body.confirmation) {
    res.json({ fail: true, message: 'Passwords must match'});
  } else {
    User.findOne({ _id: req.params.id }, function(err, user) {
      if (err) res.send(err);

      if (req.body.password === '') {
        delete req.body.password;
      }

      for (var key in req.body) {
        user[key] = req.body[key];
      }

      user.save(function(err) {
        if (err) res.send(err);

        res.json({ message: 'Successfully updated user' });
      });

    });
  }
});

// destroy
router.delete('/:id', requireUser, function(req, res) {
  User.remove({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    req.session.destroy(function(err) {
      if (err) res.send(err);

      res.json({ message: 'Successfully deleted user' });
    });
  });
});

module.exports = router;
