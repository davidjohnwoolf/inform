var m = require('mithril');

var MenuIcon = {
  controller: function() {
    var header = document.getElementById('header-wrap');
    var menu = document.getElementById('menu');
    var content = document.getElementById('content-wrap');

    var showMenu = function() {
      console.log('show menu');
      if (menu.style.display === 'none') {
        menu.style.display = 'block';
        content.style.marginTop = header.offsetHeight + 10 + 'px';
      } else {
        menu.style.display = 'none';
        content.style.marginTop = header.offsetHeight + 10 + 'px';
      }
    };
    return { showMenu: showMenu };
  },
  view: function(ctrl) {
    return m('span', { onclick: ctrl.showMenu }, m.trust('&#9776;'))
  }
}

module.exports = MenuIcon;
