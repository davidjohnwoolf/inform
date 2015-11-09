var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var RefreshButton = require('../layout/refresh-button');

// var time = month + '/' + day + '/' + year + ' ' +hours + ':' + minutes;
//
// var fromField = '<h5><a href=https://facebook.com/' + data[i].from.id + ' target=_blank>' + data[i].from.name + '</a> - ' + time + '</h5>';
//
// var messageField = findLinks(data[i].message || data[i].story, 'h4');
// var pictureField = '';
// var video = '';
// if (data[i].source) {
//   video = '<div class="picture"><video src=' + data[i].source + ' controls></video>'
// } else if (data[i].picture) {
//   pictureField = '<div class="picture"><img src=' + data[i].full_picture + ' alt=' + data[i].description + '>';
// }
// var descriptionField = '';
// if (data[i].description) {
//   descriptionField = findLinks(data[i].description, 'p');
// }
// var captionField = '';
// if (data[i].caption) {
//   captionField = '<small>' + data[i].caption + '</small>';
// } else if ((data[i].picture || data[i].source) && !data[i].caption) {
//   captionField = '</div>'
// }
// var linkField = '';
// if (data[i].link) {
//   linkField = '<a class="main-link" href=' + data[i].link + ' target=_blank>' + (data[i].name || data[i].link) + '</a>';
// }
//
// var displayString = '<article class="feed-item">' + fromField + messageField + video + pictureField + linkField + descriptionField + captionField + '</article>';

var SearchBar = {
  controller: function(args) {
    var search = function() {
      m.mount(document.getElementById('app'), m.component(FeedShow, { query: document.getElementsByName('query')[0].value }));
    }
    if (args && args.query) {
      return { search: search, query: args.query }
    } else {
      return { search: search }
    }
  },
  view: function(ctrl) {
    if (ctrl.query) {
      return m('div#search-container', [
        m('input', { type: 'text', name: 'query', value: ctrl.query }),
        m('input', { onclick: ctrl.search, type: 'submit', name: 'search', value: 'Go' }),
      ]);
    } else {
      return m('div#search-container', [
        m('input', { type: 'text', name: 'query' }),
        m('input', { onclick: ctrl.search, type: 'submit', name: 'search', value: 'Go' }),
      ]);
    }
  }
};

var FeedItems = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'),
    extract: reqHelpers.nonJsonErrors,
  }).then(authorizeHelper);
};

var SearchResults = function(query) {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/' + query,
    extract: reqHelpers.nonJsonErrors,
  }).then(authorizeHelper);
};

var FeedItem = {
  controller: function(args) {
    var conditionalElements = function() {
      var elements = [];
      if (args.video) {
        elements.push(m('video', { controls: 'controls', src: args.video }));
      } else if (args.picture) {
        elements.push(m('img', { src: args.picture, alt: args.description }));
      }
      if (args.link) {
        elements.push(m('a.main-link', { href: args.link, target: '_blank' }, args.name || args.link));
      }
      if (args.caption) {
        elements.push(m('small', args.caption));
      }
      if (args.description) {
        elements.push(m('p', args.description));
      }
      return elements;
    }
    return {
      time: args.time,
      from: args.from,
      message: args.message,
      elements: conditionalElements()
    }
  },
  view: function(ctrl) {

    return m('article.feed-item', [
      m('a[href=https://facebook.com/' + ctrl.from.id  + ']', { target: '_blank'}, [
        m('h5', ctrl.from.name + ' ' + ctrl.time)
      ]),
      m('h4', ctrl.message),
      m('div.media-wrap', [
        ctrl.elements
      ])
    ])
  }
};

var FeedShow = {
  controller: function(args) {
    if (args && args.query) {
      return { feedItems: SearchResults(args.query), query: args.query };
    } else {
      return { feedItems: FeedItems() };
    }
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.feedItems().user.feeds,
      currentFeed: m.route.param('feedId'),

      refreshButton: RefreshButton,

      searchBar: SearchBar,
      query: ctrl.query || false
    });
    return m('div', [
      ctrl.feedItems().data.map(function(item) {
        return m.component(FeedItem, {
          time: item.created_time,
          from: item.from,
          message: item.message || item.story,
          video: item.source,
          picture: item.full_picture,
          name: item.name,
          link: item.link,
          description: item.description,
          caption: item.caption,
        });
      })
    ]);
  }
};

module.exports = FeedShow;
