var m = require('mithril');

function layoutHelper(args) {
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
  // if (args.search) {
  //   m.render(document.getElementById('right-header'), [
  //     args.search
  //   ]);
  // }
}

module.exports = layoutHelper;
