var m = require('mithril');

var RefreshButton = {
  controller: function() {
    var refresh = function() {
      if (!m.route.param('sourceId')) {
        m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'));
      } else {
        m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + m.route.param('sourceId'));
      }
    }
    return { refresh: refresh };
  },
  view: function(ctrl) {
    return m('span', { onclick: ctrl.refresh }, m.trust('&#10227;'));
  }
}

module.exports = RefreshButton;
