'use strict';

var request = require('request-promise');
var User = require('../models/user');
var FeedsHelper = require('../helpers/feeds-helper');

// index
function index(req, res) {
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
}

// create
function create(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) return res.json(err);

    user.feeds.push({
      title: req.body.title,
      sources: []
    });

    user.save(function(err) {
      if (err) return res.json(err);

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
}

// edit
function edit(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) return res.json(err);

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
}

// update
function update(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) return res.json(err);

    if (req.body.filters) {
      req.body.filters = req.body.filters.split(',');
    }

    for (var key in req.body) {
      user.feeds.id(req.params.feedId)[key] = req.body[key];
    }

    user.save(function(err) {
      if (err) return res.json(err);

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
}

// show
function show(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) return res.json(err);

    var feedsHelper = FeedsHelper(user, req, res);
    var sourceCount = user.feeds.id(req.params.feedId).sources.length;
    var facebookGraphUrl = 'https://graph.facebook.com/';

    feedsHelper.checkSources();

    request(facebookGraphUrl
      + 'oauth/access_token?client_id='
      + process.env.FB_ID + '&client_secret='
      + process.env.FB_SECRET
      + '&grant_type=client_credentials')

    .then(function(accessToken) {
      request(facebookGraphUrl
        + '?' + feedsHelper.createBatchUrl()
        + '&' + accessToken + '&method=post')

      .then(feedsHelper.testResponse)
      .then(feedsHelper.parseResponse)
      .then(feedsHelper.filterResponse)
      .then(feedsHelper.sortResponse)
      .then(feedsHelper.sendResponse)
    });
  });
}

// search
function search(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) return res.json(err);

    var feedsHelper = FeedsHelper(user, req, res);
    var sourceCount = user.feeds.id(req.params.feedId).sources.length;
    var facebookGraphUrl = 'https://graph.facebook.com/';

    feedsHelper.checkSources();

    request(facebookGraphUrl
      + 'oauth/access_token?client_id='
      + process.env.FB_ID
      + '&client_secret='
      + process.env.FB_SECRET
      + '&grant_type=client_credentials')

    .then(function(accessToken) {
      request(facebookGraphUrl
        + '?' + feedsHelper.createBatchUrl()
        + '&' + accessToken + '&method=post')

      .then(feedsHelper.testResponse)
      .then(feedsHelper.parseResponse)
      .then(feedsHelper.filterResponse)
      .then(feedsHelper.queryResponse)
      .then(feedsHelper.sortResponse)
      .then(feedsHelper.sendResponse)
    });
  });
}

// destroy
function destroy(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) return res.json(err);

    user.feeds.id(req.params.feedId).remove();

    user.save(function(err) {
      if (err) return res.json(err);

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
}

module.exports = {
  index: index,
  create: create,
  edit: edit,
  update: update,
  show: show,
  search: search,
  destroy: destroy
};
