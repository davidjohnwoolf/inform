var m = require('mithril');

var LoggedInMenu = {
  controller: function(args) {
    return { userId: args.userId}
  },
  view: function(ctrl) {
    return m('div', [
      m('li', [
        m('a', { href: '/users/' + ctrl.userId, config: m.route }, 'Account'),
      ]),
      m('li', [
        m('a', { href: '/users/' + ctrl.userId + '/feeds', config: m.route }, 'Feeds'),
      ]),
      m('li', [
        m('a', { href: '/users/' + ctrl.userId + '/feeds/new', config: m.route }, 'New Feed'),
      ]),
      m('li', [
        m('a', { href: '/logout', config: m.route }, 'Logout')
      ])
    ])
  }
}

module.exports = LoggedInMenu;
