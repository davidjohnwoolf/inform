var m = require('mithril');
var MenuIcon = require('../layout/menu-icon');

function layoutHelper(args) {
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
  }
}

module.exports = layoutHelper;
