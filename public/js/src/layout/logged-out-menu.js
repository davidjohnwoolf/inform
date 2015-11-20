var m = require('mithril');

var LoggedOutMenu = {
  view: function() {
    return m('div', [
      m('li', [
        m('a', { href: '/login', config: m.route }, 'Login'),
      ]),
      m('li', [
        m('a', { href: '/users/new', config: m.route }, 'Create Account')
      ])
    ])
  }
}

module.exports = LoggedOutMenu;
