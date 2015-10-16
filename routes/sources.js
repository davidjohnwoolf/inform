'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var request = require('request');
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
    console.log('You do not have access to other users accounts');
    res.redirect('back');
  } else {
    next();
  }
}

// Feed Routes
// -----------

// index
router.get('/:id/feeds/:feedId/sources', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    res.render('sources/index', { title: 'Sources', userId: req.params.id, feed: user.feeds.id(req.params.feedId), sources: user.feeds.id(req.params.feedId).sources });
  });
});

// new
router.get('/:id/feeds/:feedId/sources/new', requireUser, function(req, res) {
  res.render('sources/new', { title: 'Add Source', userId: req.params.id, feedId: req.params.feedId });
});

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

      res.redirect('/' + user._id + '/feeds/' + req.params.feedId + '/sources');
    });
  });

});

// get facebook feed
router.get('/:id/feeds/:feedId/sources/:sourceId/facebook', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    request('https://graph.facebook.com/oauth/access_token?client_id=' + process.env.FB_ID + '&client_secret=' + process.env.FB_SECRET + '&grant_type=client_credentials', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var accessToken = body // Show the HTML for the Google homepage.
        request('https://graph.facebook.com/' + user.feeds.id(req.params.feedId).sources.id(req.params.sourceId).value + '/feed?fields=message,story,link&' + accessToken, function (error, response, body) {
          if (error) res.send(error);

          if (!error && response.statusCode == 200) {
            console.log(body);
            res.send(body);
          }
        });
      }
    });
  });
});

// show
router.get('/:id/feeds/:feedId/sources/:sourceId', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    res.render('sources/show', { title: 'Source', userId: req.params.id, feed: user.feeds.id(req.params.feedId), source: user.feeds.id(req.params.feedId).sources.id(req.params.sourceId) });
  });
});

// edit
router.get('/:id/feeds/:feedId/sources/:sourceId/edit', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    res.render('sources/edit', { title: 'Edit Feed', userId: req.params.id, feed: user.feeds.id(req.params.feedId), source: user.feeds.id(req.params.feedId).sources.id(req.params.sourceId) });
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

      res.redirect('/' + req.params.id + '/feeds/' + req.params.feedId + '/sources/' + req.params.sourceId);
    });
  });
});

// destroy
router.delete('/:id/feeds/:feedId/sources/:sourceId', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    user.feeds.id(req.params.feedId).sources.id(req.params.sourceId).remove();

    user.save(function(err) {
      res.redirect('/' + req.params.id + '/feeds/' + req.params.feedId + '/sources')
    });
  });
});

module.exports = router;
