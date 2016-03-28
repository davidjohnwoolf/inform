var m = require('mithril');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');
var FeedList = require('../feeds/feed-list');
var User = require('./models/user');
var FeedListing = require('../feeds/feed-listing');
var Feeds = require('../feeds//models/feeds');

var UserShow = {
  controller: function() {
    var deleteAccount = function(e) {
      if (confirm('Are you sure')) {
        m.request({
          method: 'DELETE',
          url: '/users/' + m.route.param('id'),
          extract: reqHelpers.nonJsonErrors,
          serialize: reqHelpers.serialize,
          config: reqHelpers.asFormUrlEncoded
        })
        .then(function(data) {
          if (!data.fail) {
            console.log(data.message);
            m.route('/');
          } else {
            console.log(data.message);
            m.route('/users/' + m.route.param('id'));
          }
        });
      }
    }
    return { user: User(), feeds: Feeds() };
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
      m('p', ctrl.user().data.email),
      m('a', { href: '/users/' + m.route.param('id') + '/edit', config: m.route }, 'Edit Account'),
      m('h2', 'My Feeds'),
      ctrl.feeds().data.map(function(feed) {
        return m.component(FeedListing, { feedId: feed._id, title: feed.title, userId: ctrl.feeds().user.id });
      }),
      m('h2', 'Danger Zone'),
      m('button.delete-button', { onclick: ctrl.deleteAccount }, 'Delete Account')
    ])
  }
};

module.exports = UserShow;
