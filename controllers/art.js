const { default: mongoose } = require("mongoose");
const ArtModel = require("../models/art");
const { uploadFile } = require("../utils/util");

exports.GET_ALL_ART = (req, res, next) => {
  ArtModel.find({})
    .populate("user")
    .exec((err, artCollection) => {
      if (err) {
        let error = new Error(err);
        return res
          .status(500)
          .send({ isSuccess: false, message: error.message });
      } else if (artCollection) {
        return res
          .status(200)
          .send({ isSuccess: true, artCollection: artCollection });
      }
    });
};

exports.CREATE_ART = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const image = req.file;
    const imageUrl = await uploadFile(image);
    const newArt = new ArtModel({
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: name,
      description: description,
      image: imageUrl,
      user: req.userId,
    });

    await newArt.save();
    return res
      .status(200)
      .send({ isSuccess: true, message: "file has successfully uploaded" });
  } catch (error) {
    let err = new Error(error);
    return res.status(500).send({ isSuccess: false, message: err.message });
  }
};

exports.UPDATE_ART = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const image = req.file;
  const updatedImage = await uploadFile(image);

  ArtModel.findByIdAndUpdate(
    { _id: id },
    {
      name: name,
      description: description,
      image: updatedImage,
    },
    {
      new: true,
      upsert: true,
    },
    (err, updatedItem) => {
      if (err)
        return res.status(500).send({ isSuccess: false, message: err.message });
      else if (updatedItem) {
        return res
          .status(200)
          .send({
            isSuccess: true,
            message: `${updatedItem.name} has succesfully updated!`,
          });
      }
    }
  );
};

exports.GET_ART_BY_ID = (req, res, next) => {
  const { id } = req.params;

  ArtModel.find({ _id: id })
    .populate("user")
    .exec((err, doc) => {
      if (err) {
        return res.status(500).send({ isSuccess: false, message: err.message });
      } else if (doc) {
        return res.status(200).send({ isSuccess: true, art: doc });
      } else {
        return res
          .status(404)
          .send({ isSuccess: false, message: "RESOURCE NOT FOUND!" });
      }
    });
};

exports.DELETE_ART = (req, res, next) => {
  const { id } = req.params;

  ArtModel.findByIdAndDelete({ _id: id }, (err, doc) => {
    if (err) {
      return res.status(500).send({ isSuccess: false, message: err.message });
    } else if (doc) {
      return res
        .status(200)
        .send({ isSuccess: true, message: `${doc.name} has been deleted!` });
    } else {
      return res
        .status(404)
        .send({ isSuccess: false, message: "RESOURCE NOT FOUND!" });
    }
  });
};
