var m = require('mithril');

var nonJsonErrors = function(xhr) {
  return xhr.status > 200 ? JSON.stringify(xhr.responseText) : xhr.responseText
}

var authorize = function(result) {
  if (result.authorized) {
    return result.data;
  } else {
    m.route('/');
    console.log('Not Authorized');
  }
}

var Feeds = function() {
  return m.request({ method: 'GET', url: '/api/data', extract: nonJsonErrors });
}

var FeedIndex = {
  controller: function() {
    var feeds = Feeds().then(authorize);
    return { feeds: feeds }
  },
  view: function(ctrl) {
    return m('h2', 'Feeds', [
      m('div', [
        ctrl.feeds().map(function(feed) {
          return m('a[href=#/users/1/feeds/' + feed.id + ']', [
            m('p', feed.title)
          ]);
        })
      ])
    ]);
  }
}

module.exports = FeedIndex;
