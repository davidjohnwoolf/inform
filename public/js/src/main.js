var m = require('mithril');
var Login = require('./sessions/login');
var FeedIndex = require('./feeds/feed-index');
var FeedShow = require('./feeds/feed-show');
var UserNew = require('./users/user-new');
var UserShow = require('./users/user-show');
var UserEdit = require('./users/user-edit');

var app = {};

m.route.mode = 'hash';

m.route(document.getElementById('app'), '/', {
  // sessions
  '/': Login,

  // password recovery
  // '/request-password': RequestPassword,
  // '/reset-password/:token': ResetPassword,

  // users
  '/users/new': UserNew,
  '/users/:id': UserShow,
  '/users/:id/edit': UserEdit,

  // feeds
  '/users/:id/feeds': FeedIndex,
  '/users/:id/feeds/:id': FeedShow,
  // '/users/:id/feeds/:id/new': FeedNew,
  // '/users/:id/feeds/:id/edit': FeedEdit,

  // sources
  // '/users/:id/feeds/:id/sources/:id': SourceShow,
  // '/users/:id/feeds/:id/sources/:id/edit': SourceEdit,
});
