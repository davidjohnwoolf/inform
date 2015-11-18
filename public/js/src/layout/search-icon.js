var m = require('mithril');

var SearchIcon = {
  controller: function() {
    var showBar = function() {
      var searchDiv = document.getElementById('search-bar');
      var header = document.getElementById('header-wrap');
      var content = document.getElementById('content-wrap');

      if (!searchDiv.style.display || searchDiv.style.display === 'none') {
        searchDiv.style.display = 'block';
        content.style.marginTop = header.offsetHeight + 10 + 'px';
      } else {
        searchDiv.style.display = 'none';
        content.style.marginTop = header.offsetHeight + 10 + 'px';
      }
    };

    return { showBar: showBar };
  },
  view: function(ctrl) {
    return m('span', { onclick: ctrl.showBar}, m.trust('&#9906;'));
  }
}

module.exports = SearchIcon;
