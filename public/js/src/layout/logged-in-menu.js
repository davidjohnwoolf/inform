var m = require('mithril');

var LoggedInMenu = function(userId) {
  return [
    m('li', [
      m('a', { href: '#/users/' + userId }, 'Profile'),
    ]),
    m('li', [
      m('a', { href: '#/users/' + userId + '/feeds' }, 'Feeds'),
    ]),
    m('li', [
      m('a', { href: '#/users/' + userId + '/feeds/new' }, 'New Feed'),
    ]),
    m('li', [
      m('a', { href: '#/users/' + userId + '/edit' }, 'Edit Account'),
    ]),
    m('li', [
      m('a', { href: '#/logout' }, 'Logout')
    ])
  ]
}

module.exports = LoggedInMenu;
