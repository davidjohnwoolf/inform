'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/user');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));

// login
router.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) res.send(err);

    if (user === null) {
      // if user does not exist
      res.send({ success: false, message: 'Username or Password Incorrect' });
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
            success: true,
            message: 'Successfully authenticated user'
            user: {
              id: user._id,
              email: user.email,
              feeds: user.feeds,
              defaultFeed: user.defaultFeed
            }
          });
        }

        if (!isMatch) {
          res.send({ success: false, message: 'Username or Password Incorrect' });
        }
      });
    }
  });
});

// logout
router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) res.send(err);

    res.send({ success: true, message: 'Successfully logged out' });
  });
});

module.exports = router;
