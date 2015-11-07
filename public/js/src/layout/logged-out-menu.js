var m = require('mithril');

var LoggedOutMenu = {
  view: function() {
    return m('div', [
      m('li', [
        m('a', { href: '#/login' }, 'Login'),
      ]),
      m('li', [
        m('a', { href: '#/users/new' }, 'Create Account')
      ])
    ])
  }
}

module.exports = LoggedOutMenu;
