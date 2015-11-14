'use strict';

var User = require('../models/user');

// login
function login(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) res.send(err);

    if (user === null) {
      // if user does not exist
      res.json({ fail: true, message: 'Username or Password Incorrect' });
    } else {
      // check to see if passwords match (method found in user model)
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) res.send(err);

        if (isMatch) {
          req.session.user = user._id
          res.json({
            message: 'Successfully logged in',
            user: {
              id: user._id,
              email: user.email,
              feeds: user.feeds,
              defaultFeed: user.defaultFeed
            }
          });
        }

        if (!isMatch) {
          res.json({ fail: true, message: 'Username or Password Incorrect' });
        }
      });
    }
  });
}

// logout
function logout(req, res) {
  req.session.destroy(function(err) {
    if (err) res.send(err);

    res.json({ message: 'Successfully logged out' });
  });
}

module.exports = {
  login: login,
  logout: logout
};
