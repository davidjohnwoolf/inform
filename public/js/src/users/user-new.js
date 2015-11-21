var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var layoutHelper = require('../helpers/layout-helper');
var LoggedOutMenu = require('../layout/logged-out-menu.js');

var UserNew = {
  controller: function() {
    var createUser = function() {
      m.request({
        method: 'POST',
        url: '/users/new',
        data: {
          email: document.getElementsByName('email')[0].value,
          password: document.getElementsByName('password')[0].value,
          confirmation: document.getElementsByName('confirmation')[0].value,
        },
        extract: reqHelpers.nonJsonErrors,
        serialize: reqHelpers.serialize,
        config: reqHelpers.asFormUrlEncoded
      })
      .then(function(data) {
        if (!data.fail) {
          console.log(data.message);
          m.route('/login');
        } else {
          console.log(data.message);
          m.route('/users/new');
          document.getElementsByName('email')[0].value = '';
          document.getElementsByName('password')[0].value = '';
          document.getElementsByName('confirmation')[0].value = '';
        }
      });
    }

    var form = {
      email: m.prop('')
    }

    return { createUser: createUser, form: form };
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedOutMenu
    });
    return m('div.content-part', [
      m('h2', 'Create Account'),
      m('div.input-block', [
        m('input', { type: 'email', name: 'email', placeholder: 'email', onchange: m.withAttr('value', ctrl.form.email), value: ctrl.form.email() })
      ]),
      m('div.input-block', [
        m('input', { type: 'password', name: 'password', placeholder: 'password' }),
      ]),
      m('div.input-block', [
        m('input', { type: 'password', name: 'confirmation', placeholder: 'confirmation' }),
      ]),
      m('div.submit-block', [
        m('input', { onclick: ctrl.createUser, type: 'submit', value: 'Create User' })
      ])
    ])
  }
}

module.exports = UserNew;
