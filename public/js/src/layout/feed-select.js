var m = require('mithril');

var FeedSelect = {
  controller: function(args) {
    var changeFeed = function() {
      if (this.value === 'select-feed') {
        this.value = m.route.param('feedId');
      } else {
        m.route('/users/' + m.route.param('id') + '/feeds/' + this.value);
      }
    };
    return { changeFeed: changeFeed, currentFeed: args.currentFeed, feeds: args.feeds };

  },
  view: function(ctrl) {
    return m('select', { onchange: ctrl.changeFeed, value: ctrl.currentFeed || 'select-feed' }, [
      m('option', { value: 'select-feed' }, 'Select Feed'),
      ctrl.feeds.map(function(feed) {
        return m('option', { value: feed._id }, feed.title);
      })
    ])
  }
}

module.exports = FeedSelect;
