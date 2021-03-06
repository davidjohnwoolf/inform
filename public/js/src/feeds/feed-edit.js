var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var FeedInfo = require('./models/feed-info');
var Messages = require('../helpers/messages');

var FeedEdit = {
  controller: function() {
    var updateFeed = function(e) {
      e.preventDefault();
      m.request({
        method: 'PUT',
        url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit',
        data: {
          title: document.getElementsByName('title')[0].value,
          filters: document.getElementsByName('filters')[0].value,
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

          m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit');
        } else {

          var alertMessage = Messages.AlertMessage(response);

          m.mount(document.getElementById('message'), alertMessage);
        }
      });
    };
    var deleteFeed = function(e) {
      if (confirm('Are you sure')) {
        m.request({
          method: 'DELETE',
          url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'),
          extract: reqHelpers.nonJsonErrors,
          serialize: reqHelpers.serialize,
          config: reqHelpers.asFormUrlEncoded
        })
        .then(authorizeHelper)
        .then(function() {
          m.route('/users/' + m.route.param('id') + '/feeds/');
        });
      }
    };
    var addSource = function(e) {
      e.preventDefault();
      if (!document.getElementsByName('name')[0].value || !document.getElementsByName('value')[0].value) {
        var alertMessage = Messages.AlertMessage({ message: 'Source Fields Cannot be Blank'});

        return m.mount(document.getElementById('message'), alertMessage);
      }

      m.request({
        method: 'POST',
        url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/new',
        data: {
          name: document.getElementsByName('name')[0].value,
          value: document.getElementsByName('value')[0].value,
          type: document.getElementsByName('type')[0].value,
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

          m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit');
        } else {
          var alertMessage = Messages.AlertMessage(response);

          m.mount(document.getElementById('message'), alertMessage);
        }
      });
    };
    var deleteSource = function(sourceId) {

      var deleteSourceFn = function() {
        if (confirm('Are you sure')) {
          m.request({
            method: 'DELETE',
            url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + sourceId,
            extract: reqHelpers.nonJsonErrors,
            serialize: reqHelpers.serialize,
            config: reqHelpers.asFormUrlEncoded
          })
          .then(authorizeHelper)
          .then(function(response) {
            if (!response.fail) {
              m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit');

              var noticeMessage = Messages.NoticeMessage(response);
              m.mount(document.getElementById('message'), noticeMessage);
            } else {
              var alertMessage = Messages.AlertMessage(response);
              m.mount(document.getElementById('message'), alertMessage);
            }
          });
        }
      }

      return deleteSourceFn;
    };

    return { feedInfo: FeedInfo(), updateFeed: updateFeed, deleteFeed: deleteFeed, addSource: addSource, deleteSource: deleteSource }
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.feedInfo().user.feeds,
      currentFeed: 'select-feed',
    });
    return m('div.content-part', [
      m('div', [
        m('h2', 'Edit Feed'),
        m('form', { onsubmit: ctrl.updateFeed }, [
          m('div.input-block', [
            m('input', { type: 'text', name: 'title', placeholder: 'edit title', value: ctrl.feedInfo().data.title || ''})
          ]),
          m('div.input-block', [
            m('input', { type: 'text', name: 'filters', placeholder: 'add filters sepatated by commas', value: ctrl.feedInfo().data.filters.join(',') || '' })
          ]),
          m('div.submit-block', [
            m('input', { type: 'submit', value: 'Update Feed' })
          ])
        ]),
        m('div.delete-form', [
          m('button.delete-button', { onclick: ctrl.deleteFeed }, 'Delete Feed' )
        ])
      ]),
      m('div', [
        m('h2', 'Add Source'),
        m('form', { onsubmit: ctrl.addSource }, [
          m('div.input-block', [
            m('input', { type: 'text', name: 'name', placeholder: 'name' })
          ]),
          m('div.input-block', [
            m('input', { type: 'text', name: 'value', placeholder: 'Facebook page ID' })
          ]),
          m('div.input-block', [
            m('select', { name: 'type' }, [
              m('option', { value: 'facebook' }, 'Facebook')
            ])
          ]),
          m('div.submit-block', [
            m('input', { type: 'submit', value: 'Add Source' })
          ])
        ])
      ]),
      m('div', [
        m('h2', 'Sources'),
        ctrl.feedInfo().data.sources.map(function(source) {
          return m('div.listed-item', [
            m('h4', [
              m('a', { href: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + source._id, config: m.route }, source.name)
            ]),
            m('button.delete-button', { onclick: ctrl.deleteSource(source._id)}, 'Delete'),
            m('a', { href: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + source._id + '/edit', config: m.route }, 'Edit')
          ])
        })
      ])
    ])
  }
}

module.exports = FeedEdit;
