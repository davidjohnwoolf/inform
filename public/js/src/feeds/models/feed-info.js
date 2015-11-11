var m = require('mithril');
var reqHelpers = require('../../helpers/request-helpers');
var authorizeHelper = require('../../helpers/authorize-helper');

var FeedInfo = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit',
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

module.exports = FeedInfo;
