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
    req.flash('alert', 'You do not have permission to access this page');
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

    var sourceCount = user.feeds.id(req.params.feedId).sources.length;
    var facebookGraphUrl = 'https://graph.facebook.com/';
    var fieldsUrl = '/feed?fields=id,message,story,link,name,caption,created_time,picture,full_picture,source,description,from';

    // get access token
    request(facebookGraphUrl + 'oauth/access_token?client_id=' + process.env.FB_ID + '&client_secret=' + process.env.FB_SECRET + '&grant_type=client_credentials', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var accessToken = body;

        // set batch string according to sources
        var batchUrl = 'batch=[';
        for (var i = 0; i < sourceCount; i++) {
          var sourceValue = user.feeds.id(req.params.feedId).sources[i].value;
          batchUrl += '{"method":"GET","relative_url":"' + sourceValue + fieldsUrl + '"},';
        }
        batchUrl = batchUrl.replace(/,\s*$/, '');
        batchUrl += ']';

        // send batch request
        request(facebookGraphUrl + '?' + batchUrl + '&' + accessToken + '&method=post', function(error, response, body) {
          if (error) res.send(error);

          if (!error && response.statusCode == 200) {
            parseResponse();

            // parse through response and push into feedData
            function parseResponse() {
              var feedData = [];
              var result = JSON.parse(body);
              for (var i = 0; i < result.length; i++) {
                var parsedResult = JSON.parse(result[i].body);
                for (var n = 0; n < parsedResult.data.length; n++) {
                  var sourceId = parsedResult.data[n].id.split('_')[0];

                  // only return posts from direct source
                  if (sourceId === parsedResult.data[n].from.id) {
                    feedData.push(parsedResult.data[n]);
                  }
                  if ((i === result.length -1) && (n === parsedResult.data.length -1)) {
                    filterResponse(feedData);
                  }
                }
              }
            }

            // pass feedData through feeds filters
            function filterResponse(feedData) {
              var filterLength = user.feeds.id(req.params.feedId).filters.length;
              if (user.feeds.id(req.params.feedId).filters[0] === '') {
                sortResponse(feedData);
              } else {
                for (var i = 0; i < feedData.length; i++) {
                  var stringValue = JSON.stringify(feedData[i]);
                  for (var c = 0; c < filterLength; c++) {
                    var filter = user.feeds.id(req.params.feedId).filters[c];
                    if (stringValue.indexOf(filter) > -1) {
                      feedData.splice(i, 1);
                      filterResponse(feedData);
                      break;
                    }
                    if ((i === feedData.length - 1) && (c === filterLength - 1)) {
                      sortResponse(feedData);
                    }
                  }
                }
              }
            }

            // sort feedData based on created_time
            function sortResponse(feedData) {
              var sortedData = feedData.sort(function(a, b) {
                if (a.created_time < b.created_time) {
                  return 1;
                } else if (a.created_time > b.created_time) {
                  return -1;
                } else {
                  return 0;
                }
              });

              // send results
              res.send(sortedData);
            }
          }
        });
      }
    });
  });
});

// search feed
router.get('/:id/feeds/:feedId/request/:q', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    var sourceCount = user.feeds.id(req.params.feedId).sources.length;
    var facebookGraphUrl = 'https://graph.facebook.com/';
    var fieldsUrl = '/feed?fields=id,message,story,link,name,caption,created_time,picture,full_picture,source,description,from';

    // get access token
    request(facebookGraphUrl + 'oauth/access_token?client_id=' + process.env.FB_ID + '&client_secret=' + process.env.FB_SECRET + '&grant_type=client_credentials', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var accessToken = body;

        // set batch string according to sources
        var batchUrl = 'batch=[';
        for (var i = 0; i < sourceCount; i++) {
          var sourceValue = user.feeds.id(req.params.feedId).sources[i].value;
          batchUrl += '{"method":"GET","relative_url":"' + sourceValue + fieldsUrl + '"},';
        }
        batchUrl = batchUrl.replace(/,\s*$/, '');
        batchUrl += ']';

        // send batch request
        request(facebookGraphUrl + '?' + batchUrl + '&' + accessToken + '&method=post', function(error, response, body) {
          if (error) res.send(error);

          if (!error && response.statusCode == 200) {

            parseResponse();

            // parse through response and push into feedData
            function parseResponse() {
              var feedData = [];
              var result = JSON.parse(body);
              for (var i = 0; i < result.length; i++) {
                var parsedResult = JSON.parse(result[i].body);
                for (var n = 0; n < parsedResult.data.length; n++) {
                  var sourceId = parsedResult.data[n].id.split('_')[0];

                  // only return posts from direct source
                  if (sourceId === parsedResult.data[n].from.id) {
                    feedData.push(parsedResult.data[n]);
                  }
                  if ((i === result.length -1) && (n === parsedResult.data.length -1)) {
                    filterResponse(feedData);
                  }
                }
              }
            }

            // pass feedData through feeds filters
            function filterResponse(feedData) {
              var filterLength = user.feeds.id(req.params.feedId).filters.length;
              if (user.feeds.id(req.params.feedId).filters[0] === '') {
                queryResponse(feedData);
              } else {
                for (var i = 0; i < feedData.length; i++) {
                  var stringValue = JSON.stringify(feedData[i]);
                  for (var c = 0; c < filterLength; c++) {
                    var filter = user.feeds.id(req.params.feedId).filters[c];
                    if (stringValue.indexOf(filter) > -1) {
                      feedData.splice(i, 1);
                      filterResponse(feedData);
                      break;
                    }
                    if ((i === feedData.length - 1) && (c === filterLength - 1)) {
                      queryResponse(feedData);
                    }
                  }
                }
              }
            }

            // parse by search query
            function queryResponse(feedData) {
              for (var i = 0; i < feedData.length; i++) {
                var stringValue = JSON.stringify(feedData[i]);
                if (stringValue.indexOf(req.params.q) === -1) {
                  feedData.splice(i, 1);
                  queryResponse(feedData);
                  break;
                }
                if (i === feedData.length -1) {
                  sortResponse(feedData);
                }
              }
            }

            // sort feedData based on created_time
            function sortResponse(feedData) {
              var sortedData = feedData.sort(function(a, b) {
                if (a.created_time < b.created_time) {
                  return 1;
                } else if (a.created_time > b.created_time) {
                  return -1;
                } else {
                  return 0;
                }
              });

              // send results
              res.send(sortedData);
            }

          }
        });
      }
    });
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

    if (req.body.filters) {
      req.body.filters = req.body.filters.split(',');
    }

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
      if (err) res.send(err);

      res.redirect('/' + req.params.id + '/feeds')
    });
  });
});

module.exports = router;
