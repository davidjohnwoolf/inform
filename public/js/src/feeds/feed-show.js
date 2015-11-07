var m = require('mithril');

var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var RefreshButton = require('../layout/refresh-button');
var SearchBar = require('../layout/search-bar');

var FeedItems = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/request',
    extract: reqHelpers.nonJsonErrors,
  }).then(authorizeHelper);
}

var FeedItem = {
  controller: function(args) {
    return {
      time: args.time,
      from: args.from,
      message: args.message,
      picture: args.picture,
      description: args.description
    }
  },
  view: function(ctrl) {
    return m('article', [
      m('p', ctrl.time),
      m('a[href=https://facebook.com/' + ctrl.from.id  + ']', { target: '_blank'}, ctrl.from.name),
      m('h5', ctrl.message),
      m('img', { src: ctrl.picture, alt: ctrl.description }),
      m('p', ctrl.description)
    ])
  }
}

var FeedShow = {
  controller: function() {
    return { feedItems: FeedItems() }
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: JSON.parse(localStorage.getItem('user')).id,

      feedSelect: FeedSelect,
      feeds: JSON.parse(localStorage.getItem('user')).feeds,
      currentFeed: m.route.param('feedId'),

      refreshButton: RefreshButton,

      searchBar: SearchBar
    });
    return m('div', [
      ctrl.feedItems().map(function(item) {
        return m.component(FeedItem, {
          time: item.created_time,
          from: item.from,
          message: item.message || item.story,
          picture: item.picture,
          description: item.description
        });
      })
    ]);
  }
}

module.exports = FeedShow;
