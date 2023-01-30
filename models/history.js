const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  activity: { type: String, required: true, max: 500 },
  description: { type: String, max: 500 },
  from: { type: String, max: 500 },
  amount: { type: String, required: true },
  createdOn: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("History", HistorySchema);
