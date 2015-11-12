'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request-promise');
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

// index
router.get('/:id/feeds', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    res.json({
      message: 'Successfully requested feeds',
      user: {
        id: user._id,
        email: user.email,
        feeds: user.feeds,
        defaultFeed: user.defaultFeed
      },
      data: user.feeds
    })
  });
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

      res.json({
        message: 'Successfully created feed',
        user: {
          id: user._id,
          email: user.email,
          feeds: user.feeds,
          defaultFeed: user.defaultFeed
        }
      });
    });
  });
});

// edit
router.get('/:id/feeds/:feedId/edit', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    res.json({
      message: 'Successfully retrieved feed info',
      user: {
        id: user._id,
        email: user.email,
        feeds: user.feeds,
        defaultFeed: user.defaultFeed
      },
      data: user.feeds.id(req.params.feedId)
    })
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

      res.json({
        message: 'Successfully updated feed',
        user: {
          id: user._id,
          email: user.email,
          feeds: user.feeds,
          defaultFeed: user.defaultFeed
        }
      });
    });
  });
});

// request
router.get('/:id/feeds/:feedId', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    var sourceCount = user.feeds.id(req.params.feedId).sources.length;
    var facebookGraphUrl = 'https://graph.facebook.com/';
    var fieldsUrl = '/feed?fields=id,message,story,link,name,caption,created_time,picture,full_picture,source,description,from';

    // make sure there is at least one source
    if (sourceCount < 1) {
      res.json({
        message: 'You have no sources. Add a source by going to feed settings (Menu > Feeds > Feed Settings)',
        user: {
          id: user._id,
          email: user.email,
          feeds: user.feeds,
          defaultFeed: user.defaultFeed
        }
      });
    }

    // get access token
    request(facebookGraphUrl + 'oauth/access_token?client_id=' + process.env.FB_ID + '&client_secret=' + process.env.FB_SECRET + '&grant_type=client_credentials', function (error, response, body) {
      if (error) res.send(error);

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
            var result = JSON.parse(body)

            // make sure all sources are valid
            for (var i = 0; i < result.length; i++) {
              if (result[i].code !== 200) {
                res.json({ message: 'Error retrieving feed, check your feed\'s source values and try again' });
                break;
              }
              if (i === result.length - 1) {
                parseResponse(result);
              }
            }
          }

          // parse through response and push into feedData
          function parseResponse(result) {
            var feedData = [];
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
            var filters = user.feeds.id(req.params.feedId).filters;
            if (feedData.length < 1) {
              res.json({
                message: 'No results, try again',
                user: {
                  id: user._id,
                  email: user.email,
                  feeds: user.feeds,
                  defaultFeed: user.defaultFeed
                }
              });
            } else if (filters[0] === '' || filters.length < 1) {
              sortResponse(feedData);
            } else {
              feedDataLoop:
              for (var i = 0; i < feedData.length; i++) {
                var stringValue = JSON.stringify(feedData[i]).toLowerCase();
                filterLoop:
                for (var c = 0; c < filters.length; c++) {
                  var filter = user.feeds.id(req.params.feedId).filters[c].toLowerCase();
                  if (stringValue.indexOf(filter) > -1) {
                    feedData.splice(i, 1);
                    filterResponse(feedData);
                    break feedDataLoop;
                  }
                  if ((i === feedData.length - 1) && (c === filters.length - 1)) {
                    if (feedData.length < 1) {
                      res.json({
                        message: 'No results, try again',
                        user: {
                          id: user._id,
                          email: user.email,
                          feeds: user.feeds,
                          defaultFeed: user.defaultFeed
                        }
                      });
                    }
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
            res.json({
              message: 'Successfully requested feed',
              user: {
                id: user._id,
                email: user.email,
                feeds: user.feeds,
                defaultFeed: user.defaultFeed
              },
              data: sortedData
            });
          }
        });
      }
    });
  });
});

// search
router.get('/:id/feeds/:feedId/:q', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    var sourceCount = user.feeds.id(req.params.feedId).sources.length;
    var facebookGraphUrl = 'https://graph.facebook.com/';
    var fieldsUrl = '/feed?fields=id,message,story,link,name,caption,created_time,picture,full_picture,source,description,from';

    // get access token
    request(facebookGraphUrl + 'oauth/access_token?client_id=' + process.env.FB_ID + '&client_secret=' + process.env.FB_SECRET + '&grant_type=client_credentials', function (error, response, body) {
      if (error) res.send(error);

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
          }
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
            var filters = user.feeds.id(req.params.feedId).filters;
            if (feedData.length < 1) {
              res.json({
                message: 'No results, try again',
                user: {
                  id: user._id,
                  email: user.email,
                  feeds: user.feeds,
                  defaultFeed: user.defaultFeed
                }
              });
            } else if (filters[0] === '' || filters.length < 1) {
              queryResponse(feedData);
            } else {
              feedDataLoop:
              for (var i = 0; i < feedData.length; i++) {
                var stringValue = JSON.stringify(feedData[i]).toLowerCase();
                filterLoop:
                for (var c = 0; c < filters.length; c++) {
                  var filter = user.feeds.id(req.params.feedId).filters[c].toLowerCase();
                  if (stringValue.indexOf(filter) > -1) {
                    feedData.splice(i, 1);
                    filterResponse(feedData);
                    break feedDataLoop;
                  }
                  if ((i === feedData.length - 1) && (c === filters.length - 1)) {
                    queryResponse(feedData);
                  }
                }
              }
            }
          }

          // parse by search query
          function queryResponse(feedData) {
            for (var i = 0; i < feedData.length; i++) {
              var stringValue = JSON.stringify(feedData[i]).toLowerCase();
              var query = req.params.q.toLowerCase();
              if (stringValue.indexOf(query) === -1) {
                feedData.splice(i, 1);
                queryResponse(feedData);
                break;
              }
              if (i === feedData.length -1) {
                if (feedData.length < 1) {
                  res.json({
                    message: 'No results, try again',
                    user: {
                      id: user._id,
                      email: user.email,
                      feeds: user.feeds,
                      defaultFeed: user.defaultFeed
                    }
                  });
                }
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
            res.json({
              message: 'Successfully recieved search results',
              user: {
                id: user._id,
                email: user.email,
                feeds: user.feeds,
                defaultFeed: user.defaultFeed
              },
              data: sortedData
            });
          }
        });
      }
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

      res.json({
        message: 'Successfully deleted feed',
        user: {
          id: user._id,
          email: user.email,
          feeds: user.feeds,
          defaultFeed: user.defaultFeed
        }
      });
    });
  });
});

module.exports = router;
