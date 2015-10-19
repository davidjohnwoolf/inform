'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/user');

// Router Middleware
// -----------------

router.use(bodyParser.urlencoded({ extended: false }));

// Session Routes
// --------------

// render login
router.get('/', function(req, res) {
  if (req.session.user) {
    res.redirect('/' + req.session.user);
  }
  res.render('sessions/login', { title: 'Login' });
});

// login
router.post('/', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) res.send(err);

    if (user === null) {
      // if user does not exist
      console.log('Wrong username');
      res.redirect('/');
    } else {
      // check to see if passwords match (method found in user model)
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) {
          return res.send(err);
        }

        if (isMatch) {
          req.session.user = user._id;
          if (user.feeds[0]) {
            res.redirect('/' + user._id + '/feeds/' + user.feeds[0]._id);
          } else {
            res.redirect('/' + user._id + '/feeds/new');
          }
        }

        if (!isMatch) {
          console.log('Wrong password');
          res.redirect('/');
        }
      });
    }
  });
});

// logout
router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) res.send(err);

    res.redirect('/');
  });
});

module.exports = router;
