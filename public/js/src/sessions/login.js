var m = require('mithril');

// make use of props and withAttrs for data binding in a secure way for passwords

function serialize(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
}

function asFormUrlEncoded(xhr) {
  xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
}

var nonJsonErrors = function(xhr) {
  return xhr.status > 200 ? JSON.stringify(xhr.responseText) : xhr.responseText
}

var Login = {
  controller: function() {
    var login = function() {
      m.request({
        method: 'POST',
        url: '/session',
        data: {
          email: document.getElementById('email-input').value,
          password: document.getElementById('password-input').value
        },
        extract: nonJsonErrors,
        serialize: serialize,
        config: asFormUrlEncoded
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
