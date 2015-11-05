var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');

var Logout = {
  controller: function() {
    return m.request({ method: 'GET', url: '/logout', extract: reqHelpers.nonJsonErrors })
      .then(function(response) {
        localStorage.setItem('user', '');
        m.route('/');
      });
  }
}

module.exports = Logout;
