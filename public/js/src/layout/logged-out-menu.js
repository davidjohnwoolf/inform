var m = require('mithril');

var LoggedOutMenu = {
  view: function() {
    return m('div[data-height="76"]', [
      m('li', [
        m('a', { href: '/', config: m.route }, 'Login'),
      ]),
      m('li', [
        m('a', { href: '/users/new', config: m.route }, 'Create Account')
      ])
    ])
  }
}

module.exports = LoggedOutMenu;
