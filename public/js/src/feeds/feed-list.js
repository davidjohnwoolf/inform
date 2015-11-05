var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');

var Feeds = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + (JSON.parse(localStorage.getItem('user')).id || 0) + '/feeds',
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
    return m('section', [
      m('h2', 'Feeds'),
      ctrl.feeds().map(function(feed) {
        return m.component(FeedListing, { id: feed.id, title: feed.title });
      })
    ]);
  }
}

module.exports = FeedList;
