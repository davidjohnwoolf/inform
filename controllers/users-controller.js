'use strict';

var User = require('../models/user');

// create
function create(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) return res.json(err);

    if (!user) {

      if (req.body.password === req.body.confirmation) {
        if (req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
          var user = new User({
            email: req.body.email,
            password: req.body.password,
            feeds: []
          });

          user.save(function(err) {
            if (err) return res.json(err);

            res.json({ message: 'Successfully created user' });
          });
        } else {
          res.json({ fail: true, message: 'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, and one number' });
        }
      } else {
        // if password and password confirmation do not match
        res.json({ fail: true, message: 'Passwords must match' });
      }

    } else {
      // if email already in use
      res.json({ fail: true, message: 'There is already an account with that email' });
    }
  });
}

// show
function show(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) return res.json(err);

    res.json({
      message: 'Successfully retrieved user',
      data: {
        id: user._id,
        email: user.email,
        feeds: user.feeds,
        defaultFeed: user.defaultFeed
      }
    });
  });
}

// update
function update(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    // comparing string and object, hence !=
    if (user && user._id != req.params.id) {
      res.json({ fail: true, message: 'Email already in use'});
    } else {
      if (req.body.password !== req.body.confirmation) {
        res.json({ fail: true, message: 'Passwords must match'});
      } else {
        User.findOne({ _id: req.params.id }, function(err, user) {
          if (err) return res.json(err);

          if (req.body.password === '') {
            delete req.body.password;
          }

          for (var key in req.body) {
            user[key] = req.body[key];
          }

          user.save(function(err) {
            if (err) return res.json(err);

            res.json({ message: 'Successfully updated user' });
          });

        });
      }
    }
  })
}

// destroy
function destroy(req, res) {
  User.remove({ _id: req.params.id }, function(err, user) {
    if (err) return res.json(err);

    req.session.destroy(function(err) {
      if (err) return res.json(err);

      res.json({ message: 'Successfully deleted user' });
    });
  });
}

module.exports = {
  create: create,
  show: show,
  update: update,
  destroy: destroy
};
