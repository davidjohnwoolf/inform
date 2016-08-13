var m = require('mithril');
var findLinks = require('../helpers/find-links');

var FeedItem = {
  controller: function(args) {
    var formatTime = function() {
      var months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ];

      return months[parseInt(args.time.slice(5, 7)) - 1] + ' ' + args.time.slice(8, 10) + ', ' + args.time.slice(0, 4)
    };
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
      if (elements.length > 0) {
        return m('div.media-wrap', [
          elements
        ]);
      } else {
        return m('div', [
          elements
        ]);
      }
    }
    return {
      time: formatTime(),
      from: args.from,
      message: m.trust(findLinks(args.message)),
      elements: conditionalElements()
    }
  },
  view: function(ctrl) {
    return m('article.feed-item', [
      m('a[href=https://facebook.com/' + ctrl.from.id  + ']', { target: '_blank'}, [
        m('h5', ctrl.from.name),
      ]),
      m('h6', ctrl.time),
      m('h4', ctrl.message),
      ctrl.elements
    ])
  }
};

module.exports = FeedItem;
