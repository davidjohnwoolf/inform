'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/user');

// Router Middleware
// -----------------

router.use(bodyParser.urlencoded({ extended: false }));

// get static page
router.get('/', function(req, res) {
  res.sendFile('public/main.html', { root: __dirname + '/../' });
});

// login
router.post('/session', function(req, res) {
  // res.send({ message: 'test' })
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) res.send(err);

    if (user === null) {
      // if user does not exist
      res.send({ message: 'Wrong Username', success: false });
    } else {
      // check to see if passwords match (method found in user model)
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) res.send(err);

        if (isMatch) {
          req.session.user = user._id;
          res.send({ message: 'Passwords Matched!', success: true });
        }

        if (!isMatch) {
          res.send({ message: 'Passwords Don\'t match', success: false });
        }
      });
    }
  });
});

// get fake data
router.get('/api/data', function(req, res) {
  // if (req.session.user) {
    // console.log('User Session');
    res.send([
      { title: 'Test1', description: 'test' },
      { title: 'Test2', description: 'test' },
      { title: 'Test3', description: 'test' },
      { title: 'Test4', description: 'test' }
    ]);
  // } else {
  //   console.log('No User session');
  //   res.send({ message: 'Not Authorized' });
  // }
});

module.exports = router;
