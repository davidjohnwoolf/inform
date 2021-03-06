var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var User = require('./models/user');
var Messages = require('../helpers/messages');

var UserEdit = {
  controller: function() {
    var updateUser = function(e) {
      e.preventDefault();
      m.request({
        method: 'PUT',
        url: '/users/' + m.route.param('id') + '/edit',
        data: {
          email: document.getElementsByName('email')[0].value,
          defaultFeed: document.getElementsByName('defaultFeed')[0].value,
          password: document.getElementsByName('password')[0].value,
          confirmation: document.getElementsByName('confirmation')[0].value,
        },
        extract: reqHelpers.nonJsonErrors,
        serialize: reqHelpers.serialize,
        config: reqHelpers.asFormUrlEncoded
      })
      .then(function(response) {
        if (!response.fail) {
          m.route('/users/' + m.route.param('id'));
        } else {
          m.route('/users/' + m.route.param('id') + '/edit');

          var alertMessage = Messages.AlertMessage(response);
          m.mount(document.getElementById('message'), alertMessage);
        }
      });
    }

    return { user: User(), updateUser: updateUser };
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.user().data.feeds,
      currentFeed: 'select-feed'
    });
    return m('div.content-part', [
      m('h2', 'Edit Account'),
      m('form', { onsubmit: ctrl.updateUser }, [
        m('div.input-block', [
          m('input', { type: 'email', name: 'email', value: ctrl.user().data.email })
        ]),
        m('div.input-block', [
          m('label', 'Default Feed'),
          m('select', { name: 'defaultFeed', value: ctrl.user().data.defaultFeed || 'select-feed' }, [
            m('option', { value: '' }, 'Select Feed'),
            ctrl.user().data.feeds.map(function(feed) {
              return m('option', { value: feed._id }, feed.title)
            })
          ])
        ]),
        m('small', 'To keep your password the same, leave blank'),
        m('div.input-block', [
          m('input', { type: 'password', name: 'password', placeholder: 'password' })
        ]),
        m('div.input-block', [
          m('input', { type: 'password', name: 'confirmation', placeholder: 'confirmation' })
        ]),
        m('div.submit-block', [
          m('input', { type: 'submit', value: 'Update User' })
        ])
      ]),
      m('p', [
        m('a', { href: '/users/' + m.route.param('id'), config: m.route }, 'Cancel')
      ])
    ])
  }
}

module.exports = UserEdit;
