var m = require('mithril');
var reqHelpers = require('../../helpers/request-helpers');
var authorizeHelper = require('../../helpers/authorize-helper');

var SearchResults = function(query) {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + m.route.param('sourceId') + '/' + query,
    extract: reqHelpers.nonJsonErrors,
  }).then(authorizeHelper);
};

module.exports = SearchResults;
