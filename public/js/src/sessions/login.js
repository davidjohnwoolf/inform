var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');

var Login = {
  controller: function() {
    var login = function() {
      m.request({
        method: 'POST',
        url: '/auth',
        data: {
          email: document.getElementById('email-input').value,
          password: document.getElementById('password-input').value
        },
        extract: reqHelpers.nonJsonErrors,
        serialize: reqHelpers.serialize,
        config: reqHelpers.asFormUrlEncoded
      }).then(function(data) {
        console.log(data.message);
        if (data.success) {
          m.route('/users/3/feeds/2');
        } else {
          document.getElementById('email-input').value = '';
          document.getElementById('password-input').value = '';
        }
      });
    }
    return { login: login };
  },
  view: function(ctrl) {
    return m('div.content-block', [
      m('h2', 'Login'),
      m('div.input-block', [
        m('input#email-input', { type: 'text', placeholder: 'email' })
      ]),
      m('div.input-block', [
        m('input#password-input', { type: 'password', placeholder: 'password' }),
      ]),
      m('div.input-block', [
        m('input', { onclick: ctrl.login, type: 'submit', value: 'Login' })
      ])
    ])
  }
}

module.exports = Login;
