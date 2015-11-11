var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var RefreshButton = require('../layout/refresh-button');

function findLinks(string) {
  var wordArray = string.split(/[ \r\n]/);
  for (var n = 0; n < wordArray.length; n++) {
    if (wordArray[n].slice(0, 4) === 'http') {
      wordArray.splice(n, 1, '<a href=' + wordArray[n] + '>' + wordArray[n] + '</a>');
    }
  }
  return wordArray.join(' ');
}

var SearchBar = {
  controller: function(args) {
    var search = function() {
      m.mount(document.getElementById('app'), m.component(FeedShow, { query: document.getElementsByName('query')[0].value }));
    }
    if (args && args.query) {
      return { search: search, query: args.query }
    } else {
      return { search: search }
    }
  },
  view: function(ctrl) {
    if (ctrl.query) {
      return m('div#search-container', [
        m('input', { type: 'text', name: 'query', value: ctrl.query }),
        m('input', { onclick: ctrl.search, type: 'submit', name: 'search', value: 'Go' }),
      ]);
    } else {
      return m('div#search-container', [
        m('input', { type: 'text', name: 'query' }),
        m('input', { onclick: ctrl.search, type: 'submit', name: 'search', value: 'Go' }),
      ]);
    }
  }
};

var FeedItems = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'),
    extract: reqHelpers.nonJsonErrors,
  }).then(authorizeHelper);
};

var SearchResults = function(query) {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/' + query,
    extract: reqHelpers.nonJsonErrors,
  }).then(authorizeHelper);
};

var FeedItem = {
  controller: function(args) {
    var conditionalElements = function() {
      var elements = [];

      if (args.video) {
        elements.push(m('video', { controls: 'controls', src: args.video }));
      } else if (args.picture) {
        elements.push(m('img', { src: args.picture, alt: args.description }));
      }
      if (args.link) {
        elements.push(m('a.main-link', { href: args.link, target: '_blank' }, args.name || args.link));
      }
      if (args.caption) {
        elements.push(m('small', args.caption));
      }
      if (args.description) {
        elements.push(m('p', m.trust(findLinks(args.description))));
      }
      return elements;
    }
    return {
      time: args.time,
      from: args.from,
      message: m.trust(findLinks(args.message)),
      elements: conditionalElements()
    }
  },
  view: function(ctrl) {
    return m('article.feed-item', [
      m('a[href=https://facebook.com/' + ctrl.from.id  + ']', { target: '_blank'}, [
        m('h5', ctrl.from.name + ' ' + ctrl.time)
      ]),
      m('h4', ctrl.message),
      m('div.media-wrap', [
        ctrl.elements
      ])
    ])
  }
};

var FeedShow = {
  controller: function(args) {
    if (args && args.query) {
      return { feedItems: SearchResults(args.query), query: args.query };
    } else {
      return { feedItems: FeedItems() };
    }
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.feedItems().user.feeds,
      currentFeed: m.route.param('feedId'),

      refreshButton: RefreshButton,

      searchBar: SearchBar,
      query: ctrl.query || false
    });

    return m('div', [
      ctrl.feedItems().data.map(function(item) {
        return m.component(FeedItem, {
          time: item.created_time,
          from: item.from,
          message: item.message || item.story,
          video: item.source,
          picture: item.full_picture,
          name: item.name,
          link: item.link,
          description: item.description,
          caption: item.caption,
        });
      })
    ]);
  }
};

module.exports = FeedShow;
