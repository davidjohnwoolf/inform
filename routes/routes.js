'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var User = require('../models/user');

router.use(bodyParser.urlencoded({ extended: false }));

// Session Routes
// ---------------------------------------------------------------------------

// render login
router.get('/', function(req, res) {
  // if user signed in redirect
  res.render('sessions/login', { title: 'Login' });
});

// login
router.post('/', function(req, res) {
  // authenticate user and redirect
  res.send('login');
});

// logout
router.get('/logout', function(req, res) {
  // delete session and redirect
  res.send('logout');
});

// User Routes
// ---------------------------------------------------------------------------

// new
router.get('/new', function(req, res) {
  res.render('users/new', { title: 'Create Account' });
});

// create
router.post('/new', function(req, res) {
  var user = new User({
    email: req.body.email,
    password: req.body.password,
    feeds: []
  });

  user.save(function(err) {
    if (err) res.send(err);

    res.redirect('/');
  });

});

// show
router.get('/:id', function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    res.render('users/show', { title: 'Profile', user: user });
  });
});

// edit
router.get('/:id/edit', function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    res.render('users/edit', { title: 'Edit Account', user: user });
  });
});

// update
router.put('/:id/edit', function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    for (var key in req.body) {
      user[key] = req.body[key];
    }

    user.save(function(err) {
      if (err) res.send(err);
    })

    res.redirect('/users/' + req.params.id);
  });
});

// destroy
router.delete('/:id', function(req, res) {
  // delete user
  res.send('delete')
});

// Feed Routes
// ---------------------------------------------------------------------------

// index
router.get('/:id/feeds', function(req, res) {
  res.render('feeds/index', { title: 'Feeds' });
});

// new
router.get('/:id/feeds/new', function(req, res) {
  res.render('feeds/new', { title: 'Create Feed', userId: req.params.id });
});

// create
router.post('/:id/feeds/new', function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    user.feeds.push({
      title: req.body.title
    });

    user.save(function(err) {
      if (err) res.send(err);

      res.redirect('/' + user._id + '/feeds');
    });
  });

});

// show
router.get('/:id/feeds/:feedId', function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    res.render('feeds/show', { title: 'Feed', feed: user.feeds.id(req.params.feedId) });
  });
});

// edit
router.get('/:id/feeds/:feedId/edit', function(req, res) {
  res.render('feeds/new', { title: 'Create Feed', userId: req.params.id, feedId: req.params.feedId });
});

// update
router.put('/:id/feeds/:feedId/edit', function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    user.feeds.id(req.params.feedId)

    // for (var key in user.feeds) {
    //   if (user.feeds[key]._id === req.params.feedId) {
    //     for (var prop in req.body) {
    //       user.feeds[key][prop] = req.body[prop];
    //     }
    //
    //     user.save(function(err) {
    //       if (err) res.send(err);
    //
    //       res.redirect('/' + req.params.id + '/feeds/' + req.params.feedId);
    //     })
    //   }
    // }
  });
});

// destroy
router.delete('/:id/feeds/:feedId', function(req, res) {
  // delete feed from user
  res.send('delete feed');
});

module.exports = router;
