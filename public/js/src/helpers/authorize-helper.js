var m = require('mithril');

// check if request response is authorized
function authorize(response) {
  if (response.authorized) {
    console.log(response.message);
    return response;
  } else {
    console.log(response.message);
    m.route('/');
  }
}

module.exports = authorize;
