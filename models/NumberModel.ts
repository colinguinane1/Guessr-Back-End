const mongoose = require("mongoose");
import User from "./UserModel";

const numberSchema = new mongoose.Schema({
  difficulty: String,
  min: Number,
  max: Number,
  value: Number,
  color: String,
  attempts: Number,
  expires: Date,
  created: { type: Date, default: Date.now },
  global_user_guesses: { type: Number, default: 0 },
  correct_user_guesses: { type: Number, default: 0 },
  correct_users: [User.schema],
});

const NumberModel = mongoose.model("Number", numberSchema);

module.exports = NumberModel;
