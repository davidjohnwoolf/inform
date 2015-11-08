var m = require('mithril');
var Login = require('./sessions/login');
var Logout = require('./sessions/logout');

var FeedList = require('./feeds/feed-list');
var FeedNew = require('./feeds/feed-new');
var FeedShow = require('./feeds/feed-show');
var FeedEdit = require('./feeds/feed-edit');

var UserNew = require('./users/user-new');
var UserShow = require('./users/user-show');
var UserEdit = require('./users/user-edit');

var app = {
  Login: Login,
  FeedList: FeedList,
  FeedNew: FeedNew,
  FeedShow: FeedShow,
  FeedEdit: FeedEdit,
  UserNew: UserNew,
  UserShow: UserShow,
  UserEdit: UserEdit,
};

m.route.mode = 'hash';

m.route(document.getElementById('app'), '/', {
  // sessions
  '/': app.Login,
  '/logout': app.Logout,

  // password recovery
  // '/request-password': app.RequestPassword,
  // '/reset-password/:token': app.ResetPassword,

  // users
  '/users/new': app.UserNew,
  '/users/:id': app.UserShow,
  '/users/:id/edit': app.UserEdit,

  // feeds
  '/users/:id/feeds': app.FeedList,
  '/users/:id/feeds/new': app.FeedNew,
  '/users/:id/feeds/:feedId': app.FeedShow,
  '/users/:id/feeds/:feedId/edit': app.FeedEdit,

  // sources
  // '/users/:id/feeds/:feedId/sources/:sourceId': app.SourceShow,
  // '/users/:id/feeds/:feedId/sources/:sourceId/edit': app.SourceEdit,
});
