var m = require('mithril');

var Model = {
  user: { email: 'david@gmail.com' }
}

var UserShow = {
  controller: function() {
    var user = Model.user;
    return { user };
  },
  view: function(ctrl) {
    return m('div', [
      m('h2', 'User Show'),
      m('p', ctrl.user.email)
    ])
  }
}

module.exports = UserShow;
