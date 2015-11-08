'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');
var User = require('../models/user');

// Router Middleware
// -----------------

router.use(bodyParser.urlencoded({ extended: false }));

function requireUser(req, res, next) {
  if (req.session.user && (req.session.user.id === req.params.id)) {
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
});

// feed index
router.get('/users/:id/feeds', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    res.send({
      authorized: true,
      data: user.feeds
    })
  });
});

// request feed
router.get('/users/:id/feeds/:feedId/request', requireUser, function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) res.send(err);

    var sourceCount = user.feeds.id(req.params.feedId).sources.length;
    var facebookGraphUrl = 'https://graph.facebook.com/';
    var fieldsUrl = '/feed?fields=id,message,story,link,name,caption,created_time,picture,full_picture,source,description,from';

    // make sure there is at least one source
    if (sourceCount < 1) {
      res.send({ message: 'You have no sources. Add a source by going to feed settings (Menu > Feeds > Feed Settings)' });
    }

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
            var result = JSON.parse(body)

            // make sure all sources are valid
            for (var i = 0; i < result.length; i++) {
              if (result[i].code !== 200) {
                res.send({ message: 'Error retrieving feed, check your feed\'s source values and try again' });
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
              res.send({ message: 'No results, try again'});
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
                    sortResponse(feedData);
                  }
                }
              }
            }
          }

          // sort feedData based on created_time
          function sortResponse(feedData) {
            if (feedData.length < 1) {
              res.send({ message: 'No results, try again'});
            }
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
            res.send({
              authorized: true,
              data: sortedData
            });
          }
        });
      }
    });
  });
});

// search feed
router.get('/users/:id/feeds/:feedId/request/:q', requireUser, function(req, res) {
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
              res.send({ message: 'No results, try again'});
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
            if (feedData.length < 1) {
              res.send({ message: 'No results, try again'});
            }
            for (var i = 0; i < feedData.length; i++) {
              var stringValue = JSON.stringify(feedData[i]).toLowerCase();
              var query = req.params.q.toLowerCase();
              if (stringValue.indexOf(query) === -1) {
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
            if (feedData.length < 1) {
              res.send({ message: 'No results, try again'});
            }
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
            res.send({
              authorized: true,
              data: sortedData
            });
          }
        });
      }
    });
  });
});

module.exports = router;
