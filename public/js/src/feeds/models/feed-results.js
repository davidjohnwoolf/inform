var m = require('mithril');
var reqHelpers = require('../../helpers/request-helpers');
var authorizeHelper = require('../../helpers/authorize-helper');

var FeedResults = function() {
  console.log(m.route.param('feedId'));
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'),
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

module.exports = FeedResults;
