const mongoose = require('mongoose');

const NumberSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true
  }
});