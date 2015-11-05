var m = require('mithril');

var LoggedOutMenu = function() {
  return [
    m('li', [
      m('a', { href: '#/login' }, 'Login'),
    ]),
    m('li', [
      m('a', { href: '#/users/new' }, 'Create Account')
    ])
  ]
}

module.exports = LoggedOutMenu;
