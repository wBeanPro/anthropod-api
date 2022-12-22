const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId },
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  vip: { type: Boolean },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  profile_photo: { type: String },
  songs: [{ type: mongoose.Types.ObjectId, ref: "Songs" }],
  followers: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
  following: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
  created_on: { type: Date, default: Date.now },
});

UserSchema.pre("save", function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = bcrypt.hashSync(user.password, 10);
    next();
  }
  next();
});

UserSchema.methods.comparePassword = function (password) {
  const user = this;
  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model("User", UserSchema);
