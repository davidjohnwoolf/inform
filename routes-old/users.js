'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var User = require('../models/user');

// Router Middleware
// -----------------

router.use(bodyParser.urlencoded({ extended: false }));
router.use(methodOverride(function(req, res) {
  // check for _method property in form requests
  // see hidden input field in views
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// Route Authorization
// -------------------

// require specific user session
function requireUser(req, res, next) {
  if (req.session.user !== req.params.id) {
    req.flash('alert', 'You do not have permission to access this page');
    res.redirect('back');
  } else {
    next();
  }
}

// User Routes
// -----------

// new
router.get('/new', function(req, res) {
  res.render('users/new', { title: 'Create Account' });
});

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
            feeds: [],
            defaultFeed: 'select-feed'
          });

          user.save(function(err) {
            if (err) res.send(err);

            res.redirect('/');
          });
        } else {
          req.flash('alert', 'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, and one number');
          res.redirect('/users/new');
        }
      } else {
        // if password and password confirmation do not match
        req.flash('alert', 'Passwords must match');
        res.redirect('/users/new');
      }

    } else {
      // if email already in use
      req.flash('alert', 'There is already an account with that email');
      res.redirect('/users/new');
    }
  });
});

// show
router.get('/:id', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    if (user.defaultFeed === 'select-feed') {
      res.render('users/show', { title: 'Profile', user: user });
    } else {
      res.render('users/show', { title: 'Profile', user: user, defaultFeed: user.feeds.id(user.defaultFeed).title });
    }
  });
});

// edit
router.get('/:id/edit', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    res.render('users/edit', { title: 'Edit Account', user: user });
  });
});

// update
router.put('/:id/edit', requireUser, function(req, res) {
  if (req.body.password !== req.body.confirmation) {
    req.flash('alert', 'Passwords must match');
    res.redirect('/users/' + req.params.id + '/edit');
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

        res.redirect('/users/' + req.params.id);
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

      res.redirect('/');
    });
  });
});

module.exports = router;
