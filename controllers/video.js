const mongoose = require('mongoose');
const { uploadFile } = require('../utils/util');
const Video = require('../models/video');
const multer = require('multer');

exports.GET_ALL_VIDEOS = (req, res, next) => {
    Video.find({})
    .populate('user')
    .exec((err, videos) => {
        if (err) res.status(500).send({isSuccess:false, message:'Something went wrong'})
        if (videos) {
            res.status(200).send({isSuccess: true, videos: videos})
        }
    })
}

exports.CREATE_VIDEO = async(req, res, next) => {
    const userId = req.userId;
    const video =  req.files['video'][0];
    const thumbnail = req.files['thumbnail'][0];
    const {title} =  req.body;
    try {
        let videoUrl = await uploadFile(video);
        let thumbnailUrl =  await uploadFile(thumbnail);
        console.log(videoUrl);
        console.log(thumbnailUrl)

        const newVideo = new Video({
            _id: new mongoose.Types.ObjectId().toHexString(),
            title: title,
            videoUrl: videoUrl,
            thumbnail:thumbnailUrl,
            user: userId
        })

        await newVideo.save();
        res.status(200).send({isSuccess: true, message: 'Video has been uploaded!'})
    } catch(error) {
        if (error instanceof multer.MulterError) {
            return res.status(500).send({isSuccess: false, message: error.message})
        }
        const ERROR = new Error(error)
        return res.status(500).send({isSuccess: false, message: ERROR.message})
    }
}

exports.UPDATE_VIDEO = async(req, res, next) => {
    const { id } = req.params;
    const { title } = req.body;
    const videoFile = req.files['video'][0];
    const thumbnailFile = req.files['thumbnail'][0];
    let updatedVideoUrl = await uploadFile(videoFile)
    let updatedThumbnail = await uploadFile(thumbnailFile)



    Video.findByIdAndUpdate(
        {_id:id},
        {
            title:title,
            videoUrl:updatedVideoUrl,
            thumbnail:updatedThumbnail,
        },
        {new:true, upsert:true},
        (err, updatedVideo) => {
            if (err) res.status(500).send({isSuccess:false, message: 'Could not edit file! Please Try again.'})
            else if (updatedVideo) res.status(200).send({isSuccess: true, updatedVideo: updatedVideo})
            else return res.status(404).send({isSuccess: false, message: 'resource does not exist!'});
        }
        )

}

exports.GET_VIDEO_BY_ID = (req, res, next) => {
    const { id } =  req.params;
    Video.findById({_id:id})
    .populate('user')
    .exec((err, video) => {
        if (err) {
            let error = new Error(err);
            return res.status(500).send({isSuccess:false, message: error.message})
        } else if(!video) {
            return res.status(404).send({isSuccess:false, message:'resource does not exist'})
        } else{
            res.status(200).send({isSuccess:true, video: video})
        }
    })
}


exports.DELETE_VIDEO = (req, res, next) => {
    const { id } = req.params;

    Video.findByIdAndDelete(
        {_id:id},
        (err, deletedItem) => {
            if (err) {
                res.status(500).send({isSuccess:false, message: 'something went wrong!'})
            } else if (deletedItem) {
                res.status(200).send({isSuccess: true, message: `${deletedItem.title} has been deleted!`})
            } else{
                res.status(404).send({isSuccess:false, message: 'Could not find file!'})
            }
        }
    )
}