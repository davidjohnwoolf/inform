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
      })
      .then(function(response) {
        console.log(response.message);
        localStorage.setItem('userId', response.user.id);
        if (!response.fail) {
          var header = document.getElementById('header-wrap');
          var menu = document.getElementById('menu');
          var content = document.getElementById('content-wrap');

          m.route(
            '/users/'
            + response.user.id
            + '/feeds/'
            + (response.user.defaultFeed || response.user.feeds[0]._id || 'new')
          );

          // reset menu
          menu.style.display = 'none';
          content.style.marginTop = header.offsetHeight + 10 + 'px';
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
    return m('section.content-part', [
      m('h2', 'Login'),
      m('div.input-block', [
        m('input', { name: 'email', type: 'email', placeholder: 'email' })
      ]),
      m('div.input-block', [
        m('input', { name: 'password', type: 'password', placeholder: 'password' }),
      ]),
      m('div.submit-block', [
        m('input', { onclick: ctrl.login, type: 'submit', value: 'Login' })
      ]),
      m('p', 'Don\'t have an account? ', [
        m('a', { href: '/users/new', config: m.route }, 'Sign Up for Free')
      ]),
      m('a', { href: '/request-password', config: m.route }, 'Forgot your password?')
    ])
  }
}

module.exports = Login;
