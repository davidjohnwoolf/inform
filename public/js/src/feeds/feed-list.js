var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');


var Feeds = function() {
  return m.request({ method: 'GET', url: '/api/data', extract: reqHelpers.nonJsonErrors });
}

var FeedList = {
  controller: function() {
    var feeds = Feeds().then(authorizeHelper);
    return { feeds: feeds }
  },
  view: function(ctrl) {
    return m('h2', 'Feeds', [
      m('div', [
        ctrl.feeds().map(function(feed) {
          return m('a[href=#/users/1/feeds/' + feed.id + ']', [
            m('p', feed.title)
          ]);
        })
      ])
    ]);
  }
}

module.exports = FeedList;
