const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PurchaseAdSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId },
  price: { type: Number },
  title: { type: String },
  period: { type: String },
  tokenAmount: { type: Number },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PurchaseAd", PurchaseAdSchema);
