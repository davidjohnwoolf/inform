var m = require('mithril');

// check if request response is authorized
function authorizeHelper(response) {
  if (!response.authorizeFail) {
    console.log(response.message);
    return response;
  } else {
    console.log(response.message);
    if (localStorage.getItem('user') && response.user !== localStorage.getItem('user')) {
      localStorage.clear();
    }
    m.route('/');
  }
}

module.exports = authorizeHelper;
