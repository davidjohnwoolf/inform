'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Source = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: String, required: true }
});

module.exports = mongoose.model('Source', Source);
