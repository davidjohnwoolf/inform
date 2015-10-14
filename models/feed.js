'use strict';

var mongoose = require('mongoose');
var Source = require('./source');
var Schema = mongoose.Schema;

var Feed = new Schema({
  title: { type: String, required: true },
  sources: [Source.schema]
});

module.exports = mongoose.model('Feed', Feed);
