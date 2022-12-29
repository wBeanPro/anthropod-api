const User = require("../models/user.js");
const helper = require("../utils/util.js");
const { UploadImage } = require("../middleware/file_middleware.js");

exports.getUser = (req, res, next) => {
  User.findById({ _id: req.userId }, function (err, user) {
    if (err)
      return res
        .status(500)
        .send({ isSuccess: false, message: "Could not get user!" });
    return res.status(200).send({
      isSuccess: true,
      id: user._id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      disclaimed: user.disclaimed,
      balance: user.balance,
      email: user.email,
      profile_photo: user.profile_photo || null,
    });
  });
};

exports.increaseBalance = async (req, res, next) => {
  try {
    User.findById(req.body.id).exec((err, user) => {
      const balance = user.balance;
      console.log("Current Balance", balance);
      User.findByIdAndUpdate(
        req.body.id,
        { balance: balance + req.body.amount },
        { upsert: true },
        (err, user) => {
          console.log(user.balance);
          const returnvalue = user.balance + req.body.amount;
          if (err)
            return res
              .status(401)
              .send({ isSucces: false, message: err.message });

          if (!user)
            return res
              .status(403)
              .send({ isSuccess: true, message: "User not found!" });

          return res.status(200).send({
            isSuccess: true,
            balance: returnvalue,
          });
        }
      );
    });
  } catch (err) {
    console.log(err);
    return res
      .status(403)
      .send({ isSucces: false, message: "unexpected error!" });
  }
};

exports.decreaseBalance = async (req, res, next) => {
  try {
    User.findById(req.body.id).exec((err, user) => {
      const balance = user.balance;
      console.log("Current Balance", balance);
      User.findByIdAndUpdate(
        req.body.id,
        { balance: balance - 50 },
        { upsert: true },
        (err, user) => {
          console.log(user.balance);
          const returnvalue = user.balance - 50;
          if (err)
            return res
              .status(401)
              .send({ isSucces: false, message: err.message });

          if (!user)
            return res
              .status(403)
              .send({ isSuccess: true, message: "User not found!" });

          return res.status(200).send({
            isSuccess: true,
            balance: returnvalue,
          });
        }
      );
    });
  } catch (err) {
    console.log(err);
    return res
      .status(403)
      .send({ isSucces: false, message: "unexpected error!" });
  }
};

exports.updateDisclaimed = async (req, res, next) => {
  const { id } = req.body;
  console.log(id);

  try {
    User.findByIdAndUpdate(
      req.body.id,
      { disclaimed: true },
      { upsert: true },
      (err, user) => {
        if (err)
          return res
            .status(401)
            .send({ isSucces: false, message: err.message });

        if (!user)
          return res
            .status(403)
            .send({ isSuccess: true, message: "User not found!" });

        return res.status(200).send({ isSuccess: true });
      }
    );
  } catch (err) {
    console.log(err);
    return res
      .status(403)
      .send({ isSucces: false, message: "unexpected error!" });
  }
};

exports.updateUser = async (req, res, next) => {
  const { file } = req;
  try {
    let profile_image_url = await helper.uploadFile(file);
    User.findByIdAndUpdate(
      req.params.id,
      { profile_photo: profile_image_url },
      { upsert: true },
      (err, user) => {
        if (err)
          res.status(401).send({ isSucces: false, message: err.message });

        if (!user)
          res.status(403).send({ isSuccess: true, message: "User not found!" });

        res
          .status(200)
          .send({ isSuccess: true, profile_photo: user.profile_photo || null });
      }
    );
  } catch (error) {
    res.status(500).send({ isSuccess: false, message: error.message });
    console.log(error);
  }
};
