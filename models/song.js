const mongoose = require("mongoose");
const User = require("./user.js");
const Genre = require("./genre.js");
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId },
  title: { type: String, required: true },
  genre: [{ type: mongoose.Types.ObjectId, ref: "Genres" }],
  fileUrl: { type: String, required: true },
  coverUrl: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  releaseDate: { type: Date, default: Date.now },
  createdOn: { type: Date, default: Date.now },
});
console.log("__________________");
SongSchema.add({
  likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Songs", SongSchema);
