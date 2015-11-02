var m = require('mithril');

var Login = {
  controller: function() {
    var login = function() {
       console.log('Not Logged In');
    }
    return { login: login };
  },
  view: function(ctrl) {
    return m('div.content-block', [
      m('h2', 'Login'),
      m('div.input-block', [
        m('input', { type: 'text', placeholder: 'email' })
      ]),
      m('div.input-block', [
        m('input', { type: 'password', placeholder: 'password' }),
      ]),
      m('div.input-block', [
        m('input', { onclick: ctrl.login, type: 'submit', value: 'Login' })
      ])
    ])
  }
}

module.exports = Login;
