const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/user.js");
const { uploadFile } = require("../utils/util.js");
const { UploadImage } = require("../middleware/file_middleware");

router.post("/", UploadImage.single("profileImage"), async function (req, res) {
  const { username, password, email, firstname, lastname } = req.body;
  const id = new mongoose.Types.ObjectId().toHexString();
  const profileImage = req.file;
  let profile_image_url = null;

  User.findOne({ username: username }, async function (err, user) {
    if (err)
      return res.status(406).send({ isSuccess: false, message: err.message });

    if (user)
      return res
        .status(406)
        .send({ isSuccess: false, message: "Username taken!" });
    if (profileImage) {
      profile_image_url = await uploadFile(profileImage);
    }

    const newUser = new User({
      _id: id,
      username,
      email,
      password,
      firstname,
      lastname,
      profile_photo: profile_image_url || "",
    });

    newUser.save(function (err, user) {
      if (err)
        return res.status(500).send({ isSuccess: false, message: err.message });
      res.status(200).send({
        isSuccess: true,
        message: `${user.id} has successfully been created!`,
      });
    });
  });
});

module.exports = router;
