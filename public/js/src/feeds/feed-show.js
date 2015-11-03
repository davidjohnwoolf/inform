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

module.exports = FeedShow;
