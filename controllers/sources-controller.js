'use strict';

var request = require('request-promise');
var User = require('../models/user');
var FeedsHelper = require('../helpers/feeds-helper');

// create
function create(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) return res.json(err);

    user.feeds.id(req.params.feedId).sources.push({
      name: req.body.name,
      type: req.body.type,
      value: req.body.value
    });

    user.save(function(err) {
      if (err) return res.json(err);

      res.json({ message: 'Successfully created source' });
    });
  });
}

// edit
function edit(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) return res.json(err);

    res.json({
      message: 'Successfully recieved source info',
      user: {
        id: user._id,
        email: user.email,
        feeds: user.feeds,
        defaultFeed: user.defaultFeed
      },
      data: user.feeds.id(req.params.feedId).sources.id(req.params.sourceId)
    });
  });
}

// update
function update(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) return res.json(err);

    for (var key in req.body) {
      user.feeds.id(req.params.feedId).sources.id(req.params.sourceId)[key] = req.body[key];
    }

    user.save(function(err) {
      if (err) return res.json(err);

      res.json({ message: 'Successfully updated source' });
    });
  });
}

// show
function show(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) return res.json(err);

    var feedsHelper = FeedsHelper(user, req, res);
    var facebookGraphUrl = 'https://graph.facebook.com/';

    request(facebookGraphUrl
      + 'oauth/access_token?client_id='
      + process.env.FB_ID + '&client_secret='
      + process.env.FB_SECRET
      + '&grant_type=client_credentials')

    .then(function(accessToken) {
      request(facebookGraphUrl
        + '?' + feedsHelper.createSourceUrl()
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
    var facebookGraphUrl = 'https://graph.facebook.com/';

    request(facebookGraphUrl
      + 'oauth/access_token?client_id='
      + process.env.FB_ID
      + '&client_secret='
      + process.env.FB_SECRET
      + '&grant_type=client_credentials')

    .then(function(accessToken) {
      request(facebookGraphUrl
        + '?' + feedsHelper.createSourceUrl()
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

    user.feeds.id(req.params.feedId).sources.id(req.params.sourceId).remove();

    user.save(function(err) {
      if (err) return res.json(err);

      res.json({ message: 'Successfully deleted source' });
    });
  });
}

module.exports = {
  create: create,
  edit: edit,
  update: update,
  show: show,
  search: search,
  destroy: destroy
};
