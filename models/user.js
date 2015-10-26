'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Feed = require('./feed');
var bcrypt = require('bcrypt');

var User = new Schema({
  email: { type: String, required: true, index: { unique: true }, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
  password: { type: String, required: true },
  feeds: [Feed.schema],
  defaultFeed: String
});

User.pre('save', function(next) {
  var user = this;

  // check if user password is new or modified
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password combined with the salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

User.methods.comparePassword = function(candidatePassword, done) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return done(err);
    }

    done(null, isMatch);
  });
};

module.exports = mongoose.model('User', User);
