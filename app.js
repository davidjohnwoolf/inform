'use strict';

var express = require('express');
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var users = require('./controllers/users');

var app = express();

// settings
var port = process.env.PORT || 1337;
app.set('view engine', 'hbs');

// database
mongoose.connect('mongodb://localhost/expressAuthSkeleton');

// middleware
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
  // to use secure cookies use https and update code
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(function(req, res, next) {
  // set session and flash info to locals
  res.locals.session = req.session;
  res.locals.flashNotice = req.flash('notice');
  res.locals.flashAlert = req.flash('alert');
  next();
});
app.use(express.static(__dirname + '/public'));
app.use('/', users);

// server
app.listen(port);
console.log('Listening...');
