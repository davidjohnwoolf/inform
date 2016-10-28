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

// adjust content to move down when search bar and menu are displayed
var menuControl = document.getElementById('menu-control');
var searchControl = document.getElementById('search-control');
var outerWrap = document.getElementById('outer-wrap');

var headerChange = function() {
  var menu = document.querySelector('#menu > div');
  if (menuControl.checked === true && searchControl.checked === true) {
      outerWrap.style.paddingTop = Number(menu.getAttribute('data-height')) + 95 + 'px';
  } else if (menuControl.checked === true) {
      outerWrap.style.paddingTop = Number(menu.getAttribute('data-height')) + 60 + 'px';
  } else if (searchControl.checked === true) {
      outerWrap.style.paddingTop = '95px';
  } else {
      outerWrap.style.paddingTop = '60px';
  }
}

menuControl.addEventListener('change', headerChange);
searchControl.addEventListener('change', headerChange);



// when hashed route changes, reset the menu and messages
(function(history) {

  var pushState = history.pushState;
  var handleRouteChange = function() {

    // reset messages
    m.mount(document.getElementById('message'), null);
    document.getElementById('message').innerHTML = '';

    // reset menu
    // document.getElementById('#menu-control').setAttribute('checked', '');
    // document.getElementById('#search-control').setAttribute('checked', '');
    // console.log('route-change')
  }

  history.pushState = function(state) {
      if (typeof history.onpushstate == "function") {
          history.onpushstate({state: state});
      }
      // ... whatever else you want to do
      // maybe call onhashchange e.handler
      return pushState.apply(history, arguments);
  }

  window.onpopstate = history.onpushstate = handleRouteChange;

})(window.history);
