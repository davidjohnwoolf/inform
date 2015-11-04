var m = require('mithril');

var Feeds = m.prop([]);

m.request({ method: 'GET', url: '/api/data' }).then(Feeds);

var FeedIndex = {
  controller: function() {
    return { feeds: Feeds };
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

module.exports = FeedIndex;
