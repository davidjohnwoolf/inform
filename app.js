'use strict';

var express = require('express');
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var sessions = require('./routes/sessions');
var users = require('./routes/users');
var feeds = require('./routes/feeds');
var sources = require('./routes/sources');
var passwordRecovery = require('./routes/password-recovery');

var app = express();

// settings
app.set('port', process.env.PORT || 1337);
app.set('view engine', 'hbs');

// database
mongoose.connect('mongodb://localhost/inform');

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
  res.locals.flashAlert = req.flash('alert');
  res.locals.flashNotice = req.flash('notice');
  next();
});
app.use(express.static(__dirname + '/public'));

app.use('/', sessions);
app.use('/', passwordRecovery);
app.use('/users', users);
app.use('/users', feeds);
app.use('/users', sources);

// error handling (taken from express generator)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// server
app.listen(app.get('port'));
console.log('Listening...');
