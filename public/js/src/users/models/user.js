var m = require('mithril');
var reqHelpers = require('../../helpers/request-helpers');
var authorizeHelper = require('../../helpers/authorize-helper');

var User = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id'),
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

module.exports = User;
