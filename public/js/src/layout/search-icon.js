var m = require('mithril');

var SearchIcon = {
  controller: function() {
    var showBar = function() {
      //old search method

      m.redraw.strategy('none');
    };

    return { showBar: showBar };
  },
  view: function(ctrl) {
    return m('span.fa.fa-search', { onclick: ctrl.showBar });
  }
}

module.exports = SearchIcon;
