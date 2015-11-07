var m = require('mithril');

function setLayout(args) {
  m.mount(
    document.getElementById('menu'),
    m.component(args.menu, { userId: args.userId })
  );

  if (args.feedSelect) {
    m.mount(
      document.getElementById('feed-select'),
      m.component(args.feedSelect, { feeds: args.feeds, currentFeed: args.currentFeed })
    );
  }
  // if (args.refreshButton) {
  //   m.render(document.getElementById('left-header'), [
  //     args.refreshButton
  //   ]);
  // }
  // if (args.search) {
  //   m.render(document.getElementById('right-header'), [
  //     args.search
  //   ]);
  // }
}

module.exports = setLayout;
