const mongoose = require("mongoose");
const { uploadFile } = require("../utils/util");
const Video = require("../models/video");
const multer = require("multer");
const video = require("../models/video");

exports.GET_ALL_VIDEOS = (req, res, next) => {
  Video.find({})
    .populate("user")
    .populate({ path: "comments", populate: { path: "id" } })
    .exec((err, videos) => {
      if (err)
        res
          .status(500)
          .send({ isSuccess: false, message: "Something went wrong" });
      if (videos) {
        console.log(videos);
        res.status(200).send({ isSuccess: true, videos: videos });
      }
    });
};

exports.video_played = (req, res, next) => {
  try {
    Video.findByIdAndUpdate(req.body.id, {
      playedOn: new Date(),
    }).exec((err, song) => {
      if (song) res.status(200).send({ isSuccess: true, video: video });
      if (err) res.status(403).send({ isSuccess: false, err });
    });
  } catch (err) {
    if (err) res.status(404).send({ isSuccess: false, err });
  }
};

exports.UPDATE_COMMENT = async (req, res, next) => {
  try {
    console.log("here", req.body);
    Video.findByIdAndUpdate(req.body.id, {
      $push: { comments: { id: req.userId, comment: req.body.comment } },
    }).exec((err, art) => {
      if (err)
        return res.status(403).send({ isSuccess: false, message: err.message });
      else {
        let returnComments = [...art.comments];
        return res.send({
          isSuccess: true,
          comments: returnComments,
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(403).send({ isSuccess: false, message: err.message });
  }
};

exports.LIKE_VIDEO = (req, res, next) => {
  try {
    Video.findById(req.body.id).exec((err, video) => {
      const checkArr = video.likes.filter((userId) => {
        if (userId.toString() === req.userId) {
          return true;
        }
        return false;
      });

      if (checkArr.length > 0) {
        console.log("already liked");
        return res.send({ isSuccess: false, message: "liked" });
      }

      Video.findByIdAndUpdate(req.body.id, {
        $push: { likes: req.userId },
      }).exec((err, video) => {
        if (err) {
          return res
            .status(403)
            .send({ isSuccess: false, message: err.message });
        }

        return res.send({ isSuccess: true, video: video });
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(403).send({ isSuccess: false, message: err.message });
  }
};

exports.CREATE_VIDEO = async (req, res, next) => {
  const userId = req.userId;
  const video = req.files["video"][0];
  const thumbnail = req.files["thumbnail"][0];
  const { title } = req.body;
  try {
    let videoUrl = await uploadFile(video);
    let thumbnailUrl = await uploadFile(thumbnail);
    console.log(videoUrl);
    console.log(thumbnailUrl);

    const newVideo = new Video({
      _id: new mongoose.Types.ObjectId().toHexString(),
      title: title,
      videoUrl: videoUrl,
      thumbnail: thumbnailUrl,
      likes: [],
      user: userId,
    });

    await newVideo.save();
    res
      .status(200)
      .send({ isSuccess: true, message: "Video has been uploaded!" });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(500).send({ isSuccess: false, message: error.message });
    }
    const ERROR = new Error(error);
    return res.status(500).send({ isSuccess: false, message: ERROR.message });
  }
};

exports.UPDATE_VIDEO = async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  const videoFile = req.files["video"][0];
  const thumbnailFile = req.files["thumbnail"][0];
  let updatedVideoUrl = await uploadFile(videoFile);
  let updatedThumbnail = await uploadFile(thumbnailFile);

  Video.findByIdAndUpdate(
    { _id: id },
    {
      title: title,
      videoUrl: updatedVideoUrl,
      thumbnail: updatedThumbnail,
    },
    { new: true, upsert: true },
    (err, updatedVideo) => {
      if (err)
        res.status(500).send({
          isSuccess: false,
          message: "Could not edit file! Please Try again.",
        });
      else if (updatedVideo)
        res.status(200).send({ isSuccess: true, updatedVideo: updatedVideo });
      else
        return res
          .status(404)
          .send({ isSuccess: false, message: "resource does not exist!" });
    }
  );
};

exports.GET_VIDEO_BY_ID = (req, res, next) => {
  const { id } = req.params;
  Video.findById({ _id: id })
    .populate("user")
    .populate({ path: "comments", populate: { path: "id" } })
    .exec((err, video) => {
      if (err) {
        let error = new Error(err);
        return res
          .status(500)
          .send({ isSuccess: false, message: error.message });
      } else if (!video) {
        return res
          .status(404)
          .send({ isSuccess: false, message: "resource does not exist" });
      } else {
        res.status(200).send({ isSuccess: true, video: video });
      }
    });
};

exports.DELETE_VIDEO = (req, res, next) => {
  const { id } = req.params;

  Video.findByIdAndDelete({ _id: id }, (err, deletedItem) => {
    if (err) {
      res
        .status(500)
        .send({ isSuccess: false, message: "something went wrong!" });
    } else if (deletedItem) {
      res.status(200).send({
        isSuccess: true,
        message: `${deletedItem.title} has been deleted!`,
      });
    } else {
      res
        .status(404)
        .send({ isSuccess: false, message: "Could not find file!" });
    }
  });
};
