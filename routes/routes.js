'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var User = require('../models/user');

// Router Middleware
// ---------------------------------------------------------------------------

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
// ---------------------------------------------------------------------------

// require specific user session
function requireUser(req, res, next) {
  if (req.session.user !== req.params.id) {
    console.log('You do not have access to other users accounts');
    res.redirect('back');
  } else {
    next();
  }
}

// Session Routes
// ---------------------------------------------------------------------------

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
          res.redirect('/' + user._id);
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
router.get('/:id', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    res.render('users/show', { title: 'Profile', user: user });
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
router.delete('/:id', requireUser, function(req, res) {
  // delete user
  res.send('delete');
});

// Feed Routes
// ---------------------------------------------------------------------------

// index
router.get('/:id/feeds', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    res.render('feeds/index', { title: 'Feeds', feeds: user.feeds });
  });
});

// new
router.get('/:id/feeds/new', requireUser, function(req, res) {
  res.render('feeds/new', { title: 'Create Feed', userId: req.params.id });
});

// create
router.post('/:id/feeds/new', requireUser, function(req, res) {
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
router.get('/:id/feeds/:feedId', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    res.render('feeds/show', { title: 'Feed', feed: user.feeds.id(req.params.feedId) });
  });
});

// edit
router.get('/:id/feeds/:feedId/edit', requireUser, function(req, res) {
  res.render('feeds/new', { title: 'Create Feed', userId: req.params.id, feedId: req.params.feedId });
});

// update
router.put('/:id/feeds/:feedId/edit', requireUser, function(req, res) {
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
router.delete('/:id/feeds/:feedId', requireUser, function(req, res) {
  // delete feed from user
  res.send('delete feed');
});

module.exports = router;
