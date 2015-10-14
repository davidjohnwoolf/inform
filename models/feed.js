'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Feed = new Schema({
  title: { type: String, required: true },
});

module.exports = mongoose.model('Feed', Feed);
