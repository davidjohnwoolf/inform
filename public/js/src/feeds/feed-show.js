var m = require('mithril');

var Model = {
  data: [
    {
      time: '5:23 10/15/2015',
      from: { id: 403, name: 'Libcom' },
      message: 'Anarchist Overthrows Government',
      picture: 'http://aphs.worldnomads.com/safetyhub/12392/greek_flag_anarchy.jpg',
      description: 'An anarchist group out of the Salt Lake Metropolitan area abolished capitalism and took down the state'
    },
    {
      time: '8:53 10/12/2015',
      from: { id: 403, name: 'Libcom' },
      message: 'Anarchist Group Starts Insurrection',
      picture: 'http://aphs.worldnomads.com/safetyhub/12392/greek_flag_anarchy.jpg',
      description: 'An anarchist group out of the Salt Lake Metropolitan area started a Revoltion'
    }
  ]
}

var FeedItem = {
  controller: function(args) {
    return {
      time: args.time,
      from: args.from,
      message: args.message,
      picture: args.picture,
      description: args.description
    }
  },
  view: function(ctrl) {
    return m('article', [
      m('p', ctrl.time),
      m('a[href=https://facebook.com/' + ctrl.from.id + ']', ctrl.from.name),
      m('h5', ctrl.message),
      m('img', { src: ctrl.picture, alt: ctrl.description }),
      m('p', ctrl.description)
    ])
  }
}

var FeedShow = {
  controller: function() {
    return { itemData: Model.data }
  },
  view: function(ctrl) {
    var feed = ctrl.itemData.map(function(item) {
      return m.component(FeedItem, {
        time: item.time,
        from: item.from,
        message: item.message,
        picture: item.picture,
        description: item.description
      });
    });
    return m('div', [
      feed
    ]);
  }
}

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

module.exports = FeedShow;
