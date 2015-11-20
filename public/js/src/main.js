var m = require('mithril');

var app = {
  Login: require('./sessions/login'),
  Logout: require('./sessions/logout'),
  UserNew: require('./users/user-new'),
  UserShow: require('./users/user-show'),
  UserEdit: require('./users/user-edit'),
  FeedList: require('./feeds/feed-list'),
  FeedNew: require('./feeds/feed-new'),
  FeedShow: require('./feeds/feed-show'),
  FeedEdit: require('./feeds/feed-edit'),
  SourceShow: require('./sources/source-show'),
  SourceEdit: require('./sources/source-edit')
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
  '/users/:id/feeds/:feedId/sources/:sourceId': app.SourceShow,
  '/users/:id/feeds/:feedId/sources/:sourceId/edit': app.SourceEdit,
});

// when hashed route changes
var handleRouteChange = function() {
  var header = document.getElementById('header-wrap');
  var menu = document.getElementById('menu');
  var content = document.getElementById('content-wrap');

  // reset menu
  menu.style.display = 'none';
  content.style.marginTop = header.offsetHeight + 10 + 'px';
}

window.addEventListener('hashchange', handleRouteChange, false);
