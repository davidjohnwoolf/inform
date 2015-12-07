var m = require('mithril');

SourceName = {
  controller: function(args) {
    return { sourceNameText: args.sourceNameText }
  },
  view: function(ctrl) {
    return m('span', ctrl.sourceNameText);
  }
};

module.exports = SourceName;
