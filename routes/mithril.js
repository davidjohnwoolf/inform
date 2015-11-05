'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/user');

// Router Middleware
// -----------------

router.use(bodyParser.urlencoded({ extended: false }));

function requireUser(req, res, next) {
  if (req.session.user.id === req.params.id) {
    next();
  } else {
    res.send({ authorized: false });
  }
}

// get static page
router.get('/', function(req, res) {
  res.sendFile('public/main.html', { root: __dirname + '/../' });
});

// login
router.post('/auth', function(req, res) {
  // res.send({ message: 'test' })
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) res.send(err);

    if (user === null) {
      // if user does not exist
      res.send({ message: 'Wrong Username', success: false });
    } else {
      // check to see if passwords match (method found in user model)
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) res.send(err);

        if (isMatch) {
          req.session.user = {
            id: user._id,
            email: user.email,
            feeds: user.feeds,
            defaultFeed: user.defaultFeed
          };
          res.send({
            authenticated: true,
            user: {
              id: user._id,
              email: user.email,
              feeds: user.feeds,
              defaultFeed: user.defaultFeed
            }
          });
        }

        if (!isMatch) {
          res.send({ authenticated: false });
        }
      });
    }
  });
});

// logout
router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) res.send(err);

    res.send({});
  });
})

// get fake data
router.get('/users/:id/feeds', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    res.send({
      authorized: true,
      data: user.feeds
    })
  });
});



module.exports = router;
