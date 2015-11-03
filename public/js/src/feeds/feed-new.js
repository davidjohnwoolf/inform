var m = require('mithril');

var FeedNew = {
  controller: function() {
    var createFeed = function() {
      console.log('Feed Not Created');
    };
    return { createFeed: createFeed };
  },
  view: function(ctrl) {
    return m('div', [
      m('h2', 'New Feed'),
      m('div', [
        m('input', { type: 'text', placeholder: 'feed name' })
      ]),
      m('div', [
        m('input', { onclick: ctrl.createFeed, type: 'submit', value: 'Create Feed' })
      ])
    ])
  }
}

module.exports = FeedNew;
