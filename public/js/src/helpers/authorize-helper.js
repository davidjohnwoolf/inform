var m = require('mithril');

// check if request response is authorized
function authorize(result) {
  if (result.authorized) {
    return result.data;
  } else {
    m.route('/');
    console.log('Not Authorized');
  }
}

module.exports = authorize;
