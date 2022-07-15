const Song = require('../models/song.js');
const { uploadFile } = require('../utils/util.js');

exports.get_all_songs = (req, res, next) => {
    try {
        Song.find({}).
        populate('user')
        .exec((err, songs) => {
            if(err || !songs) res.status(403).send({message: err.message})
            res.status(200).send({songs:songs})
        })
    } catch (error) {
        const err = new Error(error);
        res.status(500).send({message: err.message})
    }
}

exports.get_song_by_id = (req, res, next) => {
    const { id } = req.params;
    try {
        Song.findById({_id:id}).
        populate('user').
        exec((err, song) => {
            if (!song) res.status(403).send({message: ' Song does not exist!'})
            res.status(200).send({song:song})
        })
    } catch (error) {
        const err = new Error(error);
        res.status(500).send({message: err.message});
    }
}

exports.update_song = async(req, res, next) => {
    const { id } = req.params
    try{
        const fileUrl = await uploadFile(req.file);
        Song.findByIdAndUpdate(id, {
            title: req.body.title,
            fileUrl: fileUrl
        },
        {
            new:true,
            upsert:true
        },
        (err, song) => {
            if (song)  res.status(200).send({updated_song: song})
        }
        )
    } catch(error) {
        const err = new Error(error);
        res.status(500).send({message:err.message})
    }
}


exports.create_song =  (req, res, next) => {
    // should create song object and saved to database.
}