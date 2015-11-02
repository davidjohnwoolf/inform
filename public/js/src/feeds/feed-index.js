var m = require('mithril');

var Model = {
  data: [
    { id: 1, title: 'News' },
    { id: 2, title: 'International News' },
    { id: 3, title: 'Web Development' },
    { id: 4, title: 'Linux' }
  ]
}

var FeedIndex = {
  controller: function() {
    return { feeds: Model.data }
  },
  view: function(ctrl) {
    return m('h2', 'Feeds', [
      m('div', [
        ctrl.feeds.map(function(feed) {
          return m('a[href=#/users/1/feeds/' + feed.id + ']', [
            m('p', feed.title)
          ]);
        })
      ])
    ]);
  }
}

module.exports = FeedIndex;
