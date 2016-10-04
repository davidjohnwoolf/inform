var m = require('mithril');

var MenuIcon = {
  controller: function() {
    var header = document.getElementById('header-wrap');
    var menu = document.getElementById('menu');
    var content = document.getElementById('content-wrap');

    var showMenu = function() {
      //leftover from javascript menu

      m.redraw.strategy('none');
    };
    return { showMenu: showMenu };
  },
  view: function(ctrl) {
    return m('span.fa.fa-bars', { onclick: ctrl.showMenu })
  }
}

module.exports = MenuIcon;
