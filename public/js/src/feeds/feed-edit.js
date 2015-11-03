var m = require('mithril');

var Model = {
  sources: ['News', 'International Media', 'Web Development', 'Linux']
}

var FeedEdit = {
  controller: function() {
    var sources = Model.sources;
    var updateFeed = function() {
      console.log('Feed Not Updated');
    };
    var deleteFeed = function() {
      console.log('Feed Not Deleted');
    };
    var addSource = function() {
      console.log('Source Not Added');
    };
    return { sources: sources, updateFeed: updateFeed, deleteFeed: deleteFeed, addSource }
  },
  view: function(ctrl) {
    return m('div', [
      m('div', [
        m('h2', 'Edit Feed'),
        m('input', { type: 'text', placeholder: 'edit name' }),
        m('input', { type: 'text', placeholder: 'add filters' }),
        m('input', { onclick: ctrl.updateFeed, type: 'submit', value: 'Update Feed' }),
        m('button', { onclick: ctrl.deleteFeed }, 'Delete Feed' )
      ]),
      m('div', [
        m('h2', 'Add Source'),
        m('input', { type: 'text', placeholder: 'name' }),
        m('input', { type: 'text', placeholder: 'value' }),
        m('input', { type: 'radio'}),
        m('label', 'Facebook'),
        m('input', { onclick: ctrl.addSource, type: 'submit', value: 'Add Source' })
      ]),
      m('div', [
        m('h2', 'Sources'),
        ctrl.sources.map(function(source) {
          return m('h5', source);
        })
      ])
    ])
  }
}

module.exports = FeedEdit;
