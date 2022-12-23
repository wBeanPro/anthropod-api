const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArtSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true, max: 500 },
  description: { type: String, max: 500 },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  image: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  createdOn: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Art", ArtSchema);
