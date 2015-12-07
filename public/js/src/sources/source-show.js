var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var RefreshButton = require('../layout/refresh-button');
var SourceResults = require('./models/source-results');
var SearchResults = require('./models/search-results');
var FeedItem = require('../feeds/feed-item');
var SearchIcon = require('../layout/search-icon');
var SourceName = require('../layout/source-name');

var SearchBar = {
  controller: function(args) {
    var search = function() {
      m.mount(document.getElementById('app'), m.component(SourceShow, { query: document.getElementsByName('query')[0].value }));
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

var SourceShow = {
  controller: function(args) {
    if (args && args.query) {
      return { sourceResults: SearchResults(args.query), query: args.query };
    } else {
      return { sourceResults: SourceResults() };
    }
  },
  view: function(ctrl) {
    var userFeeds = ctrl.sourceResults().user.feeds;
    var sourceNameText;
    
    // set current source name to sourceNameText
    for (var i = 0; i < userFeeds.length; i++) {
      if (userFeeds[i]._id === m.route.param('feedId')) {
        for (var c = 0; c < userFeeds[i].sources.length; c++) {
          if (userFeeds[i].sources[c]._id === m.route.param('sourceId')) {
            sourceNameText = userFeeds[i].sources[c].name;
          }
        }
      }
    }

    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: userFeeds,
      currentFeed: 'select-feed',

      refreshButton: RefreshButton,

      searchBar: SearchBar,
      searchIcon: SearchIcon,
      query: ctrl.query || false,

      sourceName: SourceName,
      sourceNameText: sourceNameText
    });

    if (ctrl.sourceResults().data.length < 1) {
      return m('p.feed-error', ctrl.sourceResults().message)
    } else {
      return m('div', [
        ctrl.sourceResults().data.map(function(item) {
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
  }
};

module.exports = SourceShow;
