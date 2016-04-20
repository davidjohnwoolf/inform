'use strict';

var FeedsHelper = function(user, req, res) {

  var sourceCount = user.feeds.id(req.params.feedId).sources.length;
  var fieldsUrl = '/posts?fields=id,message,story,link,name,caption,created_time,picture,full_picture,source,description,from';

  // make sure there is at least one source
  function checkSources() {
    if (sourceCount < 1) {
      res.json({
        message: 'You have no sources. Add a source by going to feed settings: Menu > Feeds > Feed Settings',
        data: [],
        user: {
          id: user._id,
          email: user.email,
          feeds: user.feeds,
          defaultFeed: user.defaultFeed
        }
      });
    }
  }

  // set batch string according to sources
  function createBatchUrl() {
    var batchUrl = 'batch=[';
    for (var i = 0; i < sourceCount; i++) {
      var sourceValue = user.feeds.id(req.params.feedId).sources[i].value;
      batchUrl += '{"method":"GET","relative_url":"' + sourceValue + fieldsUrl + '"},';
    }
    batchUrl = batchUrl.replace(/,\s*$/, '');
    batchUrl += ']';
    return batchUrl;
  }

  // set batch string to a single source
  function createSourceUrl() {
    var batchUrl = 'batch=['
      + '{"method":"GET","relative_url":"'
      + user.feeds.id(req.params.feedId).sources.id(req.params.sourceId).value
      + fieldsUrl + '"}'
      + ']';
    return batchUrl;
  }

  // make sure all sources are valid
  function testResponse(body) {
    var result = JSON.parse(body)

    for (var i = 0; i < result.length; i++) {
      if (result[i].code !== 200) {
        res.json({
          message: 'Error retrieving feed, check your feed\'s source values and try again',
          data: [],
          user: {
            id: user._id,
            email: user.email,
            feeds: user.feeds,
            defaultFeed: user.defaultFeed
          },
        });
        break;
      }
      if (i === result.length - 1) {
        return result
      }
    }
  }

  // parse through response and push into feedData
  function parseResponse(result) {
    var feedData = [];
    for (var i = 0; i < result.length; i++) {
      var parsedResult = JSON.parse(result[i].body);
      for (var n = 0; n < parsedResult.data.length; n++) {
        feedData.push(parsedResult.data[n]);
        
        if ((i === result.length -1) && (n === parsedResult.data.length -1)) {
          return feedData;
        }
      }
    }
  }

  // pass feedData through feeds filters
  function filterResponse(feedData) {
    var filters = user.feeds.id(req.params.feedId).filters;
    if (feedData.length < 1) {
      res.json({
        message: 'No results, try editing your filters',
        data: [],
        user: {
          id: user._id,
          email: user.email,
          feeds: user.feeds,
          defaultFeed: user.defaultFeed
        }
      });
    } else if (filters[0] === '' || filters.length < 1) {
      return feedData;
    } else {
      feedDataLoop:
      for (var i = 0; i < feedData.length; i++) {
        var stringValue = JSON.stringify(feedData[i]).toLowerCase();
        filterLoop:
        for (var c = 0; c < filters.length; c++) {
          var filter = user.feeds.id(req.params.feedId).filters[c].toLowerCase();
          if (stringValue.indexOf(filter) > -1) {
            feedData.splice(i, 1);
            return filterResponse(feedData);
            break feedDataLoop;
          }
          if ((i === feedData.length - 1) && (c === filters.length - 1)) {
            if (feedData.length < 1) {
              res.json({
                message: 'No results, try editing your filters',
                data: [],
                user: {
                  id: user._id,
                  email: user.email,
                  feeds: user.feeds,
                  defaultFeed: user.defaultFeed
                }
              });
            }
            return feedData;
          }
        }
      }
    }
  }

  // parse by search query
  function queryResponse(feedData) {
    if (feedData.length < 1) {
      res.json({
        message: 'No results, try a different search',
        data: [],
        user: {
          id: user._id,
          email: user.email,
          feeds: user.feeds,
          defaultFeed: user.defaultFeed
        }
      });
    }
    for (var i = 0; i < feedData.length; i++) {
      var stringValue = JSON.stringify(feedData[i]).toLowerCase();
      var query = req.params.q.toLowerCase();
      if (stringValue.indexOf(query) === -1) {
        feedData.splice(i, 1);
        return queryResponse(feedData);
        break;
      }
      if (i === feedData.length -1) {
        if (feedData.length < 1) {
          res.json({
            message: 'No results, try a different search',
            data: [],
            user: {
              id: user._id,
              email: user.email,
              feeds: user.feeds,
              defaultFeed: user.defaultFeed
            }
          });
        }
        return feedData;
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

    return sortedData;
  }

  function sendResponse(data) {
    res.json({
      message: 'Successfully requested feed',
      user: {
        id: user._id,
        email: user.email,
        feeds: user.feeds,
        defaultFeed: user.defaultFeed
      },
      data: data
    });
  }

  return {
    checkSources: checkSources,
    createBatchUrl: createBatchUrl,
    createSourceUrl: createSourceUrl,
    testResponse: testResponse,
    parseResponse: parseResponse,
    filterResponse: filterResponse,
    queryResponse: queryResponse,
    sortResponse: sortResponse,
    sendResponse: sendResponse
  }
};

module.exports = FeedsHelper;
