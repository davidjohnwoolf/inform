var m = require('mithril');

// check if request response is authorized
function authorize(response) {
  console.log(response.message);
  if (response.success) {
    return response.data;
  } else {
    m.route('/');
  }
}

module.exports = authorize;
