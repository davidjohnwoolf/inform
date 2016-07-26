var m = require('mithril');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');
var FeedListing = require('../feeds/feed-listing');
var Feeds = require('./models/feeds');

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
    
    var feedList = m('section.content-part', [
      m('h2', 'Feeds'),
      ctrl.feeds().data.map(function(feed) {
        return m.component(FeedListing, { feedId: feed._id, title: feed.title, userId: ctrl.feeds().user.id });
      })
    ]);

    var noFeedListMessage = m('p.feed-error', 'You have no feeds, go to Menu > New Feed to create one');

    return ctrl.feeds().data.length > 0 ? feedList : noFeedListMessage
  }
};

module.exports = FeedList;
