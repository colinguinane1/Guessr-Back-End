const mongoose = require("mongoose");

const numberSchema = new mongoose.Schema({
  difficulty: String,
  min: Number,
  max: Number,
  value: Number,
  attempts: Number,
  expires: Date,
  created: { type: Date, default: Date.now },
  global_user_guesses: Number,
});

const NumberModel = mongoose.model("Number", numberSchema);

module.exports = NumberModel;
