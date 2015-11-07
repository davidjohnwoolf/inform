var m = require('mithril');

// var searchBar = document.createElement('div');
// searchBar.setAttribute('id', 'search-container');
// searchBar.innerHTML = '<input id="search" type="text" name="search" placeholder="search"><input id="search-button" type="button" value="Go">'
// document.getElementById('right-header').appendChild(searchBar);
// content.style.marginTop = header.offsetHeight + 10 + 'px';
//
// var searchButton = document.getElementById('search-button');
// var searchQuery = document.getElementById('search');
// searchButton.addEventListener('click', function() {
//   document.getElementById('display').innerHTML = '';
//   httpRequest.open('GET', window.location + '/request/' + searchQuery.value);
//   httpRequest.send(null);
// });

var SearchBar = {
  controller: function() {
    var search = function() {
      m.route(
        '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/' +
        document.getElementsByName('query')[0].value
      );
    }
    return { search: search }
  },
  view: function(ctrl) {
    return m('div#search-container', [
      m('input', { type: 'text', name: 'query' }),
      m('input', { onclick: ctrl.search, type: 'submit', name: 'search', value: 'Go' }),
    ])
  }
}

module.exports = SearchBar;
