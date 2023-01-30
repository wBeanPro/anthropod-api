const PurchaseAd = require("../models/purchaseAd");
const mongoose = require("mongoose");

exports.GET_ALL_PURCHASE = (req, res, next) => {
  PurchaseAd.find({}, (err, purchaseAds) => {
    if (err) return res.status(500).send({ isSucces: false, purchaseAds: [] });
    else if (purchaseAds && purchaseAds.length > 0) {
      return res.status(200).send({ isSucess: true, purchaseAds: purchaseAds });
    } else {
      return res.status(400).send({ isSucces: false, purchaseAds: [] });
    }
  });
};

exports.CREATE_PURCHASE = async (req, res, next) => {
  const { name } = req.body;

  let newGenre = new PurchaseAd({
    _id: new mongoose.Types.ObjectId().toHexString(),
    price: 1400,
    title: "Music Page Feature",
    period: "1 Month",
    tokenAmount: 35000,
  });

  newGenre.save((err, genre) => {
    if (err)
      res
        .status(500)
        .send({ isSuccess: false, message: "could not save genre!" });
    if (genre)
      res.status(200).send({
        isSuccess: true,
        message: `new ${genre.id} for ${genre.name}`,
      });
  });
};
