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
}

var FeedListing = {
  controller: function(args) {
    return {
      id: args.id,
      title: args.title
    }
  },
  view: function(ctrl) {
    return m('div', [
      m('a', { href: '#/users/' + JSON.parse(localStorage.getItem('user')).id + '/feeds/' + ctrl.id }, [
        m('h4', ctrl.title)
      ]),
      m('a', { href: '#/users/' + JSON.parse(localStorage.getItem('user')).id + '/feeds/' + ctrl.id + '/edit' }, 'Settings')
    ])
  }
}

var FeedList = {
  controller: function() {
    return { feeds: Feeds() }
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: JSON.parse(localStorage.getItem('user')).id,

      feedSelect: FeedSelect,
      feeds: JSON.parse(localStorage.getItem('user')).feeds,
      currentFeed: 'select-feed',
    });
    return m('section', [
      m('h2', 'Feeds'),
      ctrl.feeds().map(function(feed) {
        return m.component(FeedListing, { id: feed._id, title: feed.title });
      })
    ]);
  }
}

module.exports = FeedList;
