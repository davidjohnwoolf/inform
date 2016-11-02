var m = require('mithril');

var RefreshButton = {
  controller: function() {
    var refresh = function() {

      // animate spining icon
      document.querySelector('#refresh-button .fa-refresh').style.transform = 'rotate(360deg)';

      if (!m.route.param('sourceId')) {
        m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'));
      } else {
        m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + m.route.param('sourceId'));
      }
    }
    return { refresh: refresh };
  },
  view: function(ctrl) {
    return m('span.fa.fa-refresh', { onclick: ctrl.refresh });
  }
}

module.exports = RefreshButton;
