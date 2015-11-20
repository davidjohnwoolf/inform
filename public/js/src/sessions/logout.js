var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');

var Logout = {
  controller: function() {
    localStorage.clear();
    return m.request({
      method: 'GET', url: '/logout', extract: reqHelpers.nonJsonErrors
    })
    .then(function(response) {
      m.route('/');
    });
  }
}

module.exports = Logout;
