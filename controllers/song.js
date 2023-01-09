const { default: mongoose } = require("mongoose");
const { UploadAudio } = require("../middleware/file_middleware.js");
const Song = require("../models/song.js");
const { uploadFile } = require("../utils/util.js");

exports.get_all_songs = (req, res, next) => {
  try {
    Song.find(
      {},
      {
        title: 1,
        likes: 1,
        genre: 1,
        fileUrl: 1,
        coverUrl: 1,
        user: 1,
        priceByToken: 1,
        releaseDate: 1,
        createdOn: 1,
        playedOn: 1,
        playCount: 1,
      }
    )
      .populate("likes")
      .populate("user")
      .populate("genre")
      .exec((err, songs) => {
        if (err || !songs)
          res.status(403).send({ isSuccess: false, message: err.message });
        res.status(200).send({ isSuccess: true, songs: songs });
      });
  } catch (error) {
    const err = new Error(error);
    res.status(500).send({ isSuccess: false, message: err.message });
  }
};

exports.update_like_status = (req, res, next) => {
  try {
    console.log("SONG liKED", req.body.id);
    Song.findById(req.body.id).exec((err, song) => {
      const checkArr = song.likes.filter((userId) => {
        if (userId.toString() === req.userId) {
          return true;
        }
        return false;
      });

      if (checkArr.length > 0) {
        console.log("already liked");
        return res.send({ isSuccess: false, message: "liked" });
      }

      Song.findByIdAndUpdate(req.body.id, {
        $push: { likes: [req.userId] },
      }).exec((err, song) => {
        if (err)
          return res
            .status(403)
            .send({ isSuccess: false, message: err.message });
        return res.send({ isSuccess: true, likes: song.likes });
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(403).send({ isSuccess: false, message: err.message });
  }
};

exports.get_song_by_id = (req, res, next) => {
  const { id } = req.params;
  try {
    Song.findById({ _id: id })
      .populate("user")
      .populate("genre")
      .exec((err, song) => {
        if (!song)
          res
            .status(403)
            .send({ isSuccess: false, message: " Song does not exist!" });
        res.status(200).send({ isSuccess: true, song: song });
      });
  } catch (error) {
    const err = new Error(error);
    res.status(500).send({ isSuccess: false, message: err.message });
  }
};

exports.song_played = async (req, res, next) => {
  try {
    Song.findByIdAndUpdate(req.body.id, {
      playedOn: new Date(),
      $inc: { playCount: 1 },
    }).exec((err, song) => {
      if (song) {
        console.log(song.playCount);
        res.status(200).send({ isSuccess: true, song: song });
      }
      if (err) res.status(403).send({ isSuccess: false, err });
    });
  } catch (err) {
    if (err) res.status(404).send({ isSuccess: false, err });
  }
};

exports.update_song = async (req, res, next) => {
  const { id } = req.params;
  const song = req.file;
  try {
    const fileUrl = await uploadFile(song);
    Song.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        fileUrl: fileUrl,
      },
      {
        new: true,
        upsert: true,
      },
      (err, song) => {
        if (song) res.status(200).send({ isSuccess: true, updated_song: song });
      }
    );
  } catch (error) {
    const err = new Error(error);
    res.status(500).send({ isSuccess: false, message: err.message });
  }
};

exports.get_songs_by_user_id = (req, res, next) => {
  const { id } = req.params;

  try {
    Song.find({})
      .populate("user")
      .populate("genre")
      .where("user")
      .equals(id)
      .exec((err, songs) => {
        if (!songs)
          return res
            .status(403)
            .send({ isSuccess: false, message: "Resource does not exist!" });
        else if (songs)
          return res.status(200).send({ isSuccess: true, songs: songs });
      });
  } catch (error) {
    const err = new Error(error);
    return res.status(500).send({ isSuccess: false, message: err.message });
  }
};

exports.remove_song = async (req, res, next) => {
  try {
    console.log(req.body.id, req.params);
    Song.remove({ _id: req.params.id }).exec((err, result) => {
      console.log(result);
      if (err) {
        return res.status(403).send({ isSuccess: false, message: err.message });
      } else {
        return res.send({ isSuccess: true, message: "success" });
      }
    });
  } catch (err) {}
};

exports.create_song = async (req, res, next) => {
  // should create song object and saved to database.
  try {
    let CoverUrl = "";
    let publicCoverUrl = "";
    console.log(req.body.priceByToken);

    if (req.files["cover"]) {
      CoverUrl = req.files["cover"][0];
      publicCoverUrl = await uploadFile(CoverUrl);
    }
    const SongFileUrl = req.files["song"][0];

    if (!Array.isArray(req.body.genre)) {
      req.body.genre = [req.body.genre];
    }
    let publicSongFileUrl = await uploadFile(SongFileUrl);

    let newSong = new Song({
      _id: new mongoose.Types.ObjectId().toHexString(),
      title: req.body.title,
      likes: [],
      fileUrl: publicSongFileUrl,
      coverUrl: publicCoverUrl,
      genre: req.body.genre,
      user: req.userId,
      priceByToken: Number(req.body.priceByToken),
    });

    await newSong.save();
    res.status(201).send({
      isSuccess: true,
      message: `${newSong.title} has been  succesfully created!`,
    });
  } catch (error) {
    const err = new Error(error);
    console.log(error);
    res.status(500).send({ isSuccess: false, message: err.message });
  }
};
