const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tempSchema = new Schema({
    temperature: Number   
  });
  
  module.exports = mongoose.model('temperatures',tempSchema);