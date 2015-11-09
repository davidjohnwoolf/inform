var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var layoutHelper = require('../helpers/layout-helper');
var authorizeHelper = require('../helpers/authorize-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');

var FeedInfo = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit',
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

var FeedEdit = {
  controller: function() {
    var updateFeed = function() {
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
        .then(function() {
          m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'));
        });
    };
    var deleteFeed = function() {
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
    };
    var addSource = function() {
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
        .then(function() {
          m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit');
        });
    };
    var deleteSource = function(sourceId) {
      var deleteSourceFn = function() {
        m.request({
          method: 'DELETE',
          url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + sourceId,
          extract: reqHelpers.nonJsonErrors,
          serialize: reqHelpers.serialize,
          config: reqHelpers.asFormUrlEncoded
        })
          .then(authorizeHelper)
          .then(function() {
            m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit');
          });
        return deleteSourceFn;
      }
    };
    return { feedInfo: FeedInfo(), updateFeed: updateFeed, deleteFeed: deleteFeed, addSource: addSource, deleteSource: deleteSource }
  },
  view: function(ctrl) {
    console.log(ctrl.feedInfo().data);
    return m('div', [
      m('div', [
        m('h2', 'Edit Feed'),
        m('input', { type: 'text', name: 'title', placeholder: 'edit title', value: ctrl.feedInfo().data.title || ''}),
        m('input', { type: 'text', name: 'filters', placeholder: 'edit filters', value: ctrl.feedInfo().data.filters.join(',') || '' }),
        m('input', { onclick: ctrl.updateFeed, type: 'submit', value: 'Update Feed' }),
        m('button', { onclick: ctrl.deleteFeed }, 'Delete Feed' )
      ]),
      m('div', [
        m('h2', 'Add Source'),
        m('input', { type: 'text', name: 'name', placeholder: 'name' }),
        m('input', { type: 'text', name: 'value', placeholder: 'value' }),
        m('input', { type: 'radio', name: 'type', value: 'Facebook' }),
        m('label', 'Facebook'),
        m('input', { onclick: ctrl.addSource, type: 'submit', value: 'Add Source' })
      ]),
      m('div', [
        m('h2', 'Sources'),
        ctrl.feedInfo().data.sources.map(function(source) {
          return m('div', [
            m('a', { href: '#/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources' + source._id }, source.name),
            m('a', { href: '#/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources' + source._id + '/edit' }, 'Edit Source'),
            m('a', { onclick: ctrl.deleteSource(source._id), href: ''}, 'Delete Source')
          ])
        })
      ])
    ])
  }
}

module.exports = FeedEdit;
