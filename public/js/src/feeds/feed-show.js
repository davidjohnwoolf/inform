var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var RefreshButton = require('../layout/refresh-button');
var FeedResults = require('./models/feed-results');
var SearchResults = require('./models/search-results');
var findLinks = require('../helpers/find-links');

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
      return m('div.search-container', [
        m('input', { type: 'text', name: 'query', value: ctrl.query }),
        m('input', { onclick: ctrl.search, type: 'submit', name: 'search', value: 'Go' }),
      ]);
    } else {
      return m('div.search-container', [
        m('input', { type: 'text', name: 'query' }),
        m('input', { onclick: ctrl.search, type: 'submit', name: 'search', value: 'Go' }),
      ]);
    }
  }
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
      if (args.description) {
        elements.push(m('p', m.trust(findLinks(args.description))));
      }
      if (args.caption) {
        elements.push(m('small', args.caption));
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
      return { feedResults: SearchResults(args.query), query: args.query };
    } else {
      return { feedResults: FeedResults() };
    }
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.feedResults().user.feeds,
      currentFeed: m.route.param('feedId'),

      refreshButton: RefreshButton,

      searchBar: SearchBar,
      searchIcon: SearchIcon,
      query: ctrl.query || false
    });

    return m('div', [
      ctrl.feedResults().data.map(function(item) {
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
