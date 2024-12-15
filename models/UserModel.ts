import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
const NumberModel = require("./NumberModel");

interface IUser extends Document {
  username: string;
  email: string;
  guessed_numbers: (typeof NumberModel)[];
  xp: number;
  profile_views: number;
  password: string;
  matchPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  guessed_numbers: [{ type: Schema.Types.ObjectId, ref: "Number" }],
  xp: { type: Number, default: 0 },
  profile_views: { type: Number, default: 0 },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
