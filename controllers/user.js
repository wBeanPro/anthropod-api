const User = require("../models/user.js");
const helper = require("../utils/util.js");
const { UploadImage } = require("../middleware/file_middleware.js");

exports.getUser = (req, res, next) => {
  User.findById({ _id: req.userId }, function (err, user) {
    if (err)
      return res
        .status(500)
        .send({ isSuccess: false, message: "Could not get user!" });
    return res
      .status(200)
      .send({
        isSuccess: true,
        id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        profile_photo: user.profile_photo || null,
      });
  });
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
