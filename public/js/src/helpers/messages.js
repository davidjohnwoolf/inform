var m = require('mithril');

var AlertMessage = function(response) {
  var component = {
    view: function() {
      return m('div.alert', response.message);
    }
  }
  return component;
}

var NoticeMessage = function(response) {
  var component = {
    view: function() {
      return m('div.notice', response.message);
    }
  }
  return component;
}

module.exports = {
  AlertMessage: AlertMessage,
  NoticeMessage: NoticeMessage
};
