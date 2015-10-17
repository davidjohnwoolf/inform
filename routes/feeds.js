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
router.get('/:id/feeds', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    res.render('feeds/index', { title: 'Feeds', userId: req.params.id, feeds: user.feeds });
  });
});

// return json feeds list
router.get('/:id/feedlist', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    res.send(user);
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
      title: req.body.title,
      sources: []
    });

    user.save(function(err) {
      if (err) res.send(err);

      res.redirect('/' + user._id + '/feeds');
    });
  });

});

// request feed
router.get('/:id/feeds/:feedId/request', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    var feedData = []
    var sourceCount = user.feeds.id(req.params.feedId).sources.length;

    for (var i = 0; i < sourceCount; i++) {
      var sourceValue = user.feeds.id(req.params.feedId).sources[i].value;
      singleRequest(sourceValue, i);
    }

    function singleRequest(source, i) {
      request('https://graph.facebook.com/oauth/access_token?client_id=' + process.env.FB_ID + '&client_secret=' + process.env.FB_SECRET + '&grant_type=client_credentials', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var accessToken = body // Show the HTML for the Google homepage.
          request('https://graph.facebook.com/' + source + '/feed?fields=message,story,link,created_time,picture,description,from&' + accessToken, function (error, response, body) {
            if (error) res.send(error);

            if (!error && response.statusCode == 200) {
              var result = JSON.parse(body)
              feedData = feedData.concat(result.data);
              dataCheck(i)
            }
          });
        }
      });
    }
    function dataCheck(i) {
      setTimeout(function() {
        if (i == sourceCount -1) {
          var sortedData = feedData.sort(function(a, b) {
            if (a.created_time < b.created_time) {
              return 1;
            } else if (a.created_time > b.created_time) {
              return -1;
            } else {
              return 0;
            }
          });
          res.send(sortedData);
        }
      }, 500)
    }

  });
});

// show
router.get('/:id/feeds/:feedId', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    res.render('feeds/show', { title: 'Feed', userId: req.params.id, feed: user.feeds.id(req.params.feedId) });
  });
});

// edit
router.get('/:id/feeds/:feedId/edit', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    res.render('feeds/edit', { title: 'Edit Feed', userId: req.params.id, feed: user.feeds.id(req.params.feedId) });
  });
});

// update
router.put('/:id/feeds/:feedId/edit', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    for (var key in req.body) {
      user.feeds.id(req.params.feedId)[key] = req.body[key];
    }

    user.save(function(err) {
      if (err) res.send(err);

      res.redirect('/' + req.params.id + '/feeds/' + req.params.feedId);
    });
  });
});

// destroy
router.delete('/:id/feeds/:feedId', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    user.feeds.id(req.params.feedId).remove();

    user.save(function(err) {
      res.redirect('/' + req.params.id + '/feeds')
    });
  });
});

module.exports = router;
