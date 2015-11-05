var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var layoutHelper = require('../helpers/layout-helper');
var loggedInMenu = require('../layout/logged-in-menu.js');
var loggedOutMenu = require('../layout/logged-out-menu.js');

var Login = {
  controller: function() {
    var login = function() {
      m.request({
        method: 'POST',
        url: '/auth',
        data: {
          email: document.getElementsByName('email')[0].value,
          password: document.getElementsByName('password')[0].value
        },
        extract: reqHelpers.nonJsonErrors,
        serialize: reqHelpers.serialize,
        config: reqHelpers.asFormUrlEncoded
      }).then(function(response) {
        if (response.authenticated) {
          localStorage.setItem('user', JSON.stringify(response.user));
          m.route('/users/' + JSON.parse(localStorage.getItem('user')).id + '/feeds/' + (
            JSON.parse(localStorage.getItem('user')).defaultFeed ||
            JSON.parse(localStorage.getItem('user')).feeds[0] ||
            'new'
          ));
        } else {
          document.getElementsByName('email')[0].value = '';
          document.getElementsByName('password')[0].value = '';
          console.log('Username or Password Incorrect');
        }
      });
    }
    return { login: login };
  },
  view: function(ctrl) {
    layoutHelper({
      menu: loggedOutMenu
    });
    return m('section', [
      m('h2', 'Login'),
      m('div', [
        m('input', { name: 'email', type: 'text', placeholder: 'email' })
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
