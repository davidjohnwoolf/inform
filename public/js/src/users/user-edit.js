var m = require('mithril');

var Model = {
  user: { email: 'david@test.com' }
}

var UserEdit = {
  controller: function() {
    var updateUser = function() {
      console.log('User Not Updated');
    }
    var user = Model.user;
    return { updateUser: updateUser, user: user };
  },
  view: function(ctrl) {
    return m('div.content-block', [
      m('h2', 'Login'),
      m('div.input-block', [
        m('input', { type: 'text', value: ctrl.user.email })
      ]),
      m('div.input-block', [
        m('input', { type: 'password', placeholder: 'password' }),
      ]),
      m('div.input-block', [
        m('input', { type: 'password', placeholder: 'confirmation' }),
      ]),
      m('div.input-block', [
        m('input', { onclick: ctrl.updateUser, type: 'submit', value: 'Update User' })
      ])
    ])
  }
}

module.exports = UserEdit;
