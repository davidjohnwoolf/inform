var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');

var Feeds = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds',
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

var FeedListing = {
  controller: function(args) {
    return {
      id: args.id,
      title: args.title,
      userId: args.userId,
      feedId: args.feedId
    }
  },
  view: function(ctrl) {
    return m('div', [
      m('a', { href: '#/users/' + ctrl.userId + '/feeds/' + ctrl.feedId }, [
        m('h4', ctrl.title)
      ]),
      m('a', { href: '#/users/' + ctrl.userId + '/feeds/' + ctrl.feedId + '/edit' }, 'Settings')
    ])
  }
};

var FeedList = {
  controller: function() {
    return { feeds: Feeds() }
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.feeds().user.feeds,
      currentFeed: 'select-feed',
    });
    return m('section', [
      m('h2', 'Feeds'),
      ctrl.feeds().data.map(function(feed) {
        return m.component(FeedListing, { feedId: feed._id, title: feed.title, userId: ctrl.feeds().user.id });
      })
    ]);
  }
};

module.exports = FeedList;
