var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');

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
      }).then(function(data) {
        console.log(data.message);
        if (data.success) {
          m.route('/users/3/feeds/2');
        } else {
          document.getElementsByName('email')[0].value = '';
          document.getElementsByName('password')[0].value = '';
        }
      });
    }
    return { login: login };
  },
  view: function(ctrl) {
    return m('section', [
      m('h2', 'Login'),
      m('div', [
        m('input[name=email]', { type: 'text', placeholder: 'email' })
      ]),
      m('div', [
        m('input[name=password]', { type: 'password', placeholder: 'password' }),
      ]),
      m('div', [
        m('input', { onclick: ctrl.login, type: 'submit', value: 'Login' }),
        m('a', { href: '/request-password' }, 'Forgot your password?')
      ])
    ])
  }
}

module.exports = Login;
