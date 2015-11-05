var m = require('mithril');

function setLayout(args) {
  return m.render(document.getElementById('menu'), [
    args.menu()
  ]);

  // if (args.feedSelect) {
  //   m.render(document.getElementById('left-header'), [
  //     args.feedSelect
  //   ]);
  // }
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
