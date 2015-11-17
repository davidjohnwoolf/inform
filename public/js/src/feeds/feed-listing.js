var m = require('mithril');

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
    return m('div.listed-item', [
      m('h4', [
        m('a', { href: '/users/' + ctrl.userId + '/feeds/' + ctrl.feedId, config: m.route }, ctrl.title)
      ]),
      m('a', { href: '/users/' + ctrl.userId + '/feeds/' + ctrl.feedId + '/edit', config: m.route }, 'Settings')
    ])
  }
};

module.exports = FeedListing;
