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
        m('div.input-block', [
          m('input', { type: 'text', name: 'title', placeholder: 'edit title', value: ctrl.feedInfo().data.title || ''})
        ]),
        m('div.input-block', [
          m('input', { type: 'text', name: 'filters', placeholder: 'edit filters', value: ctrl.feedInfo().data.filters.join(',') || '' })
        ]),
        m('div.submit-block', [
          m('input', { onclick: ctrl.updateFeed, type: 'submit', value: 'Update Feed' })
        ]),
        m('div.delete-form', [
          m('button.delete-button', { onclick: ctrl.deleteFeed }, 'Delete Feed' )
        ])
      ]),
      m('div', [
        m('h2', 'Add Source'),
        m('div.input-block', [
          m('input', { type: 'text', name: 'name', placeholder: 'name' })
        ]),
        m('div.input-block', [
          m('input', { type: 'text', name: 'value', placeholder: 'value' })
        ]),
        m('div.input-block', [
          m('select', { name: 'type' }, [
            m('option', { value: 'facebook' }, 'Facebook')
          ])
        ]),
        m('div.submit-block', [
          m('input', { onclick: ctrl.addSource, type: 'submit', value: 'Add Source' })
        ]),
      ]),
      m('div', [
        m('h2', 'Sources'),
        ctrl.feedInfo().data.sources.map(function(source) {
          return m('div.listed-item', [
            m('h4', [
              m('a', { href: '#/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + source._id }, source.name)
            ]),
            m('a.delete-button', { onclick: ctrl.deleteSource(source._id), href: ''}, 'Delete Source'),
            m('a', { href: '#/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + source._id + '/edit' }, 'Edit Source')
          ])
        })
      ])
    ])
  }
}

// <div class="content-part">
//   <h2>{{title}}</h2>
//
//   <form action="/users/{{userId}}/feeds/{{feed._id}}/edit" method="post">
//     <input type="hidden" name="_method" value="put">
//     <div class="input-block">
//       <label for="title">Update Feed Title</label>
//       <input type="text" name="title" value="{{feed.title}}" placeholder="title">
//     </div>
//     <div class="input-block">
//       <label for="filters">Update Filters</label>
//       <small>(List Filters separated by a commas)</small>
//       <input type="text" name="filters" value="{{feed.filters}}" placeholder="some filter,another filter">
//     </div>
//     <div class="submit-block">
//       <input type="submit" value="Update Feed">
//     </div>
//   </form>
//
//   <form class="delete-form" onsubmit="return confirm('Are you sure you want to delete this feed?')" action="/users/{{userId}}/feeds/{{feed._id}}" method="post" enctype="application/x-www-form-urlencoded">
//     <input type="hidden" name="_method" value="delete">
//     <input class="delete-button" type="submit" value="Delete Feed">
//   </form>
//
//   <h2>Add Source</h2>
//
//   <form action="/users/{{userId}}/feeds/{{feed._id}}/sources/new" method="post">
//     <div class="input-block">
//       <input type="text" name="name" placeholder="name">
//     </div>
//     <div class="input-block">
//       <input type="text" name="value" placeholder="value">
//     </div>
//     <div class="input-block">
//       <select name="type">
//         <option value="facebook">Facebook</option>
//       </select>
//     </div>
//     <div class="submit-block">
//       <input type="submit" value="Add Source">
//     </div>
//   </form>
//
//   <h2>Sources</h2>
//   <ul>
//     {{#each feed.sources}}
//       <li class="listed-source">
//         <h4><a href="/users/{{../userId}}/feeds/{{../feed._id}}/sources/{{_id}}">{{name}}</a></h4>
//         <form onsubmit="return confirm('Are you sure you want to delete this feed?')" action="/users/{{../userId}}/feeds/{{../feed._id}}/sources/{{_id}}" method="post" enctype="application/x-www-form-urlencoded">
//           <input type="hidden" name="_method" value="delete">
//           <input type="submit" class="delete-button" value="X">
//         </form>
//         <a class="edit-button" href="/users/{{../userId}}/feeds/{{../feed._id}}/sources/{{_id}}/edit">Edit</a>
//       </li>
//     {{/each}}
//   </ul>
// </div>


module.exports = FeedEdit;
