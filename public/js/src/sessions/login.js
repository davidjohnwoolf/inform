var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var layoutHelper = require('../helpers/layout-helper');
var LoggedOutMenu = require('../layout/logged-out-menu.js');

var Login = {
  controller: function() {
    var login = function() {
      m.request({
        method: 'POST',
        url: '/login',
        data: {
          email: document.getElementsByName('email')[0].value,
          password: document.getElementsByName('password')[0].value
        },
        extract: reqHelpers.nonJsonErrors,
        serialize: reqHelpers.serialize,
        config: reqHelpers.asFormUrlEncoded
      }).then(function(response) {
        console.log(response.message);
        if (!response.fail) {
          m.route('/users/' + response.user.id + '/feeds/' + (
            response.user.defaultFeed ||
            response.user.feeds[0] ||
            'new'
          ));
        } else {
          document.getElementsByName('email')[0].value = '';
          document.getElementsByName('password')[0].value = '';
        }
      });
    }
    return { login: login };
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedOutMenu
    });
    return m('section', [
      m('h2', 'Login'),
      m('div', [
        m('input', { name: 'email', type: 'email', placeholder: 'email' })
      ]),
      m('div', [
        m('input', { name: 'password', type: 'password', placeholder: 'password' }),
      ]),
      m('div', [
        m('input', { onclick: ctrl.login, type: 'submit', value: 'Login' }),
        m('a', { href: '/request-password' }, 'Forgot your password?')
      ])
    ])
  }
}

module.exports = Login;
