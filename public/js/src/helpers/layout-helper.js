var m = require('mithril');
var MenuIcon = require('../layout/menu-icon');

function layoutHelper(args) {

  var searchDiv = document.getElementById('search-bar');
  var header = document.getElementById('header-wrap');
  var content = document.getElementById('content-wrap');

  m.mount(
    document.getElementById('menu-icon'),
    m.component(MenuIcon)
  );

  m.mount(
    document.getElementById('menu'),
    m.component(args.menu, { userId: args.userId })
  );

  if (args.feedSelect) {
    m.mount(
      document.getElementById('feed-select'),
      m.component(args.feedSelect, { feeds: args.feeds, currentFeed: args.currentFeed })
    );
  } else {
    m.mount(document.getElementById('feed-select'), null);
  }

  if (args.refreshButton) {
    m.mount(
      document.getElementById('refresh-button'),
      m.component(args.refreshButton)
    );
  } else {
    m.mount(document.getElementById('refresh-button'), null);
  }

  if (args.searchBar) {
    m.mount(document.getElementById('search-icon'), args.searchIcon);
    if (args.query) {
      m.mount(
        document.getElementById('search-bar'),
        m.component(args.searchBar, { query: args.query })
      );
    } else {
      m.mount(
        document.getElementById('search-bar'),
        m.component(args.searchBar)
      );
    }
  } else {
    m.mount(document.getElementById('search-bar'), null);
    m.mount(document.getElementById('search-icon'), null);
  }

  if (args.sourceName) {
    m.mount(
      document.getElementById('source-name'),
      m.component(args.sourceName, { sourceNameText: args.sourceNameText})
    );
  } else {
    m.mount(document.getElementById('source-name'), null);
  }
}

module.exports = layoutHelper;
