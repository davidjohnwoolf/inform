'use strict';

var crypto = require('crypto');
var nodemailer = require('nodemailer');
var User = require('../models/user');

// request password
function forgot(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) return res.json(err);

    if (!user) {
      res.json({ fail: true, message: 'Email doesn\'nt match a record' });
    } else {
      crypto.randomBytes(20, function(err, buf) {
        if (err) return res.json(err);

        var token = buf.toString('hex');
        setResetToken(token);
      });
    }

    function setResetToken(token) {
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;

      user.save(function(err) {
        if (err) return res.json(err);

        sendResetEmail(token);
      });
    }

    function sendResetEmail(token) {
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'davidjohnwoolf@gmail.com',
          pass: process.env.EMAIL_PASSWORD
        }
      });

      var mailOptions = {
        to: user.email,
        from: 'no-reply@info.rm',
        subject: 'Inform Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };

      transporter.sendMail(mailOptions, function(err) {
        if (err) return res.json(err);

        res.json({ message: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
      });
    }
  });
}

// authorize password reset
function authorizeReset(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      res.json({ fail: true, message: 'Reset token is not valid' });
      return res.redirect('/forgot');
    }
    res.json({ message: 'Reset token is valid' });
  });
}

// reset password
function reset(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      res.json({ fail: true, message: 'Reset token is not valid' });
    } else if (req.body.password !== req.body.confirmation) {
      res.json({ fail: true, message: 'Passwords Must Match' });
    } else {
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      user.save(function(err) {
        if (err) return res.json(err);

        sendConfirmationEmail();
      });
    }

    function sendConfirmationEmail(token) {
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'davidjohnwoolf@gmail.com',
          pass: process.env.EMAIL_PASSWORD
        }
      });

      var mailOptions = {
        to: user.email,
        from: 'no-reply@info.rm',
        subject: 'Inform Password Confirmation',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };

      transporter.sendMail(mailOptions, function(err) {
        if (err) return res.json(err);

        res.json({ message: 'Successfully reset password' });
      });
    }
  });
}

module.exports = {
  forgot: forgot,
  authorizeReset: authorizeReset,
  reset: reset
};
