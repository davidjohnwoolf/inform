var m = require('mithril');

var LoggedInMenu = {
  controller: function(args) {
    return { userId: args.userId}
  },
  view: function(ctrl) {
    return m('div', [
      m('li', [
        m('a', { href: '#/users/' + ctrl.userId }, 'Profile'),
      ]),
      m('li', [
        m('a', { href: '#/users/' + ctrl.userId + '/feeds' }, 'Feeds'),
      ]),
      m('li', [
        m('a', { href: '#/users/' + ctrl.userId + '/feeds/new' }, 'New Feed'),
      ]),
      m('li', [
        m('a', { href: '#/users/' + ctrl.userId + '/edit' }, 'Edit Account'),
      ]),
      m('li', [
        m('a', { href: '#/logout' }, 'Logout')
      ])
    ])
  }
}

module.exports = LoggedInMenu;
