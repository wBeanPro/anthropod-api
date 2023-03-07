const User = require("../models/user.js");
const History = require("../models/history");
const helper = require("../utils/util.js");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
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
      withdraw_balance: user.withdraw_balance,
      email: user.email,
      profile_photo: user.profile_photo || null,
    });
  });
};

exports.resetPassword = (req, res, next) => {
  console.log(req.body);
  try {
    if (req.body.newPass != req.body.confirmPass) {
      return res.send({ isSuccess: false, message: "Not Confirmed" });
    }
    User.findById(req.userId, function (err, user) {
      if (err) return res.status(403).send({ isSuccess: false });
      if (user && user.comparePassword(req.body.oldPass)) {
        User.findByIdAndUpdate(
          req.userId,
          { password: bcrypt.hashSync(req.body.newPass, 10) },
          {
            new: true,
            upsert: true,
          },
          (err, user) => {
            if (user) return res.send({ isSuccess: true });
          }
        );
      } else {
        return res.send({ isSuccess: false, message: "not match" });
      }
    });
  } catch (err) {
    return res.status(403).send({ isSucces: false });
  }
};

exports.getHistory = async (req, res) => {
  try {
    History.find({ user: req.userId }).exec((err, histories) => {
      if (err) {
        return res.status(405).send({ isSucces: false, message: err.message });
      }

      return res.send({ isSuccess: true, histories: histories });
    });
  } catch (err) {
    console.log(err);
  }
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
          let newHistory = new History({
            _id: new mongoose.Types.ObjectId().toHexString(),
            user: req.userId,
            activity: "Buy tokens",
            description: "Bought successfully",
            from: "Credit Card",
            amount: req.body.amount,
          });
          newHistory.save();
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

exports.increaseWithdrawBalance = async (req, res, next) => {
  try {
    User.findById(req.body.id).exec((err, user) => {
      const withdraw_balance = user.withdraw_balance;
      console.log("Current Balance", withdraw_balance);
      User.findByIdAndUpdate(
        req.body.id,
        { withdraw_balance: withdraw_balance + req.body.amount },
        { upsert: true },
        (err, user) => {
          console.log(user.withdraw_balance);
          const returnvalue = user.withdraw_balance + req.body.amount;
          let newHistory = new History({
            _id: new mongoose.Types.ObjectId().toHexString(),
            user: req.userId,
            activity: "Buy tokens",
            description: "Bought successfully",
            from: "Credit Card",
            amount: req.body.amount,
          });
          newHistory.save();
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
            withdraw_balance: returnvalue,
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

exports.decreaseWithdrawBalance = async (req, res, next) => {
  try {
    User.findById(req.body.id).exec((err, user) => {
      const withdraw_balance = user.withdraw_balance;
      console.log("Current Balance", withdraw_balance);
      User.findByIdAndUpdate(
        req.body.id,
        { withdraw_balance: withdraw_balance - req.body.amount },
        { upsert: true },
        (err, user) => {
          console.log(user.withdraw_balance);
          const returnvalue = user.withdraw_balance - req.body.amount;
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
            withdraw_balance: returnvalue,
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
