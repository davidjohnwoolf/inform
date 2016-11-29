var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var layoutHelper = require('../helpers/layout-helper');
var authorizeHelper = require('../helpers/authorize-helper');
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var SourceInfo = require('./models/source-info');
var Messages = require('../helpers/messages');

var SourceEdit = {
  controller: function() {
    var updateSource = function(e) {
      e.preventDefault();
      m.request({
        method: 'PUT',
        url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + m.route.param('sourceId') + '/edit',
        data: {
          name: document.getElementsByName('name')[0].value,
          value: document.getElementsByName('value')[0].value,
        },
        extract: reqHelpers.nonJsonErrors,
        serialize: reqHelpers.serialize,
        config: reqHelpers.asFormUrlEncoded
      })
        .then(authorizeHelper)
        .then(function(response) {
          if (!response.fail) {
            var noticeMessage = Messages.NoticeMessage(response);
            m.mount(document.getElementById('message'), noticeMessage);

            m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + m.route.param('sourceId') + '/edit');
          } else {
            var alertMessage = Messages.AlertMessage(response);
            m.mount(document.getElementById('message'), alertMessage);
          }
        });
    };

    return { sourceInfo: SourceInfo(), updateSource: updateSource };
  },
  view: function(ctrl) {
    m.mount(document.getElementById('search-bar'), null);
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.sourceInfo().user.feeds,
      currentFeed: 'select-feed',
    });
    return m('div.content-part', [
      m('h2', 'Edit Source'),
      m('form', { onsubmit: ctrl.updateSource }, [
        m('div.input-block', [
          m('input', { type: 'text', name: 'name', placeholder: 'edit name', value: ctrl.sourceInfo().data.name || ''})
        ]),
        m('div.input-block', [
          m('input', { type: 'text', name: 'value', placeholder: 'edit value', value: ctrl.sourceInfo().data.value || '' })
        ]),
        m('div.submit-block', [
          m('input', { type: 'submit', value: 'Update Source' })
        ])
      ]),
      m('p', [
        m('a', { href: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit', config: m.route }, 'Cancel')
      ])
    ])
  }
}

module.exports = SourceEdit;
