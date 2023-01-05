const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  title: { type: String, required: true, max: 500 },
  videoUrl: { type: String, required: true },
  likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  comments: [
    {
      id: { type: Schema.Types.ObjectId, ref: "User" },
      comment: { type: String },
    },
  ],
  thumbnail: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1483032469466-b937c425697b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjR8fG11c2ljJTIwbm90ZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  createdOn: { type: Date, default: Date.now() },
  playedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Video", VideoSchema);
