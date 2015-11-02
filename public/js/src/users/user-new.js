var m = require('mithril');

var UserNew = {
  controller: function() {
    var createUser = function() {
      console.log('User Not Created');
    }
    return { createUser: createUser };
  },
  view: function(ctrl) {
    console.log(ctrl.data);
    return m('div.content-block', [
      m('h2', 'Login'),
      m('div.input-block', [
        m('input', { type: 'text', placeholder: 'email' })
      ]),
      m('div.input-block', [
        m('input', { type: 'password', placeholder: 'password' }),
      ]),
      m('div.input-block', [
        m('input', { type: 'password', placeholder: 'confirmation' }),
      ]),
      m('div.input-block', [
        m('input', { onclick: ctrl.createUser, type: 'submit', value: 'Create User' })
      ])
    ])
  }
}

module.exports = UserNew;
