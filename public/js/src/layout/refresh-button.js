var m = require('mithril');

var RefreshButton = {
  controller: function() {
    var refresh = function() {
      m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'));
    }
    return { refresh: refresh };
  },
  view: function(ctrl) {
    return m('span', { onclick: ctrl.refresh }, m.trust('&#10227;'));
  }
}

module.exports = RefreshButton;
