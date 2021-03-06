var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');
var Feeds = require('./models/feeds');

var FeedNew = {
  controller: function() {
    var createFeed = function(e) {
      e.preventDefault();
      m.request({
        method: 'POST',
        url: '/users/' + m.route.param('id') + '/feeds/new',
        data: {
          title: document.getElementsByName('title')[0].value
        },
        extract: reqHelpers.nonJsonErrors,
        serialize: reqHelpers.serialize,
        config: reqHelpers.asFormUrlEncoded
      })
      .then(authorizeHelper)
      .then(function() {
        m.route('/users/' + m.route.param('id') + '/feeds');
      });
    };
    return { createFeed: createFeed, feeds: Feeds() };
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.feeds().user.feeds,
      currentFeed: 'select-feed',
    });
    return m('div.content-part', [
      m('h2', 'Create Feed'),
      m('form', { onsubmit: ctrl.createFeed }, [
        m('div.input-block', [
          m('input.info-input', { type: 'text', name: 'title', placeholder: 'create a name for your feed' })
        ]),
        m('div.submit-block', [
          m('input', { type: 'submit', value: 'Create Feed' })
        ])
      ]),
      m('p', [
        m('a', { href: '/users/' + m.route.param('id') + '/feeds', config: m.route }, 'Cancel')
      ])
    ])
  }
};

module.exports = FeedNew;
