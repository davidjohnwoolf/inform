var m = require('mithril');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');
var FeedList = require('../feeds/feed-list');
var User = require('./models/user');


var UserShow = {
  controller: function() {
    return { user: User() };
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.user().data.feeds,
      currentFeed: 'select-feed'
    });
    return m('div.content-part', [
      m('h2', 'Profile'),
      m('p', ctrl.user().data.email)
    ])
  }
};

module.exports = UserShow;
