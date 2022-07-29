const mongoose = require('mongoose');
const Playlist = require('../models/playlist');
const Song = require('../models/song');
const User = require('../models/user');
const { uploadFile } = require('../utils/util');

exports.CREATE_PLAYLIST = (req, res, next) => {
    
    const playlist = new Playlist({
        _id: new mongoose.Types.ObjectId().toHexString(),
        name: req.body.name,
        user: req.body.user
    })

    try {
        playlist.save((err, doc) => {
            if (err) return res.staus(400).send({message:err.message})

            res.status(200).send({ message:`${doc.name} has create successfully!`})
        })
    } catch (error) {
        const err = new Error(error)
        res.status(500).send({error: err.message});
    }
}

exports.GET_PLAYLIST_BY_ID = (req, res, next) => {
    const { id } = req.params;

    Playlist.findById({_id:id})
    .populate('user')
    .populate('songs')
    .exec((err, playlist) => {
        if (err) res.status(404).send({message: 'playlist does not exist!'})
        res.status(200).send({playlist:playlist})
    })
}

exports.UPDATE_IMAGE = async (req, res, next) => {
    const { id } = req.params;
    const  cover  =  req.file;

        const newCoverUrl = await uploadFile(cover);
        Playlist.findByIdAndUpdate({_id:id}, 
            {image: newCoverUrl},
            {
                new: true,
                upsert:true
            }, (err, updatedCover) => {
                
                if (err) return res.status(400).send({message: `could not update resource`})
                if (updatedCover) {
                    res.status(200).send({cover: updatedCover})
                }
            })
    
    
}

exports.ADD_SONG_TO_PLAYLIST = (req, res, next) => {
    const { id } = req.params
    const { song } =  req.body;

    Playlist.findByIdAndUpdate(
        {_id:id },
        {$push: {songs: song}},
         { new: true, upsert: true},
         (err, updatedPlaylist) => {
            if (err) res.status(400).send({message: err.message})
            if (updatedPlaylist) {
                res.status(200).send({playlist: updatedPlaylist})
            }
         }
        );
}

exports.REMOVE_SONG_FROM_PLAYLIST = (req, res, next) => {
    const { id, songId } =  req.params;
    console.log(songId)
    Playlist.findByIdAndUpdate(
        {_id:id},
        {$pull: {songs: songId}},
        {new: true, upsert:true},
        (err, updatedPlaylist) => {
            if (err) res.status(400).send({message:'could not find resource for deletion'})
            if (updatedPlaylist){
                res.status(200).send({message:'item has been removed!'})
            }
        }
    )
} 

exports.UPDATE_PLAYLIST = async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const cover = req.file;
    let updatedCover = await uploadFile(cover)
    Playlist.findByIdAndUpdate(
        {_id: id},
        {name: name, image: updatedCover},
        {new:true, upsert:true},
        (err, updatedPlaylist) => {
            if (err) res.status(500).send({message: err.message})
            if (updatedPlaylist){
                res.status(200).send({playlist: updatedPlaylist});
            }
        }
    )
}

exports.DELETE_PLAYLIST = (req, res, next) => {
    const { id } = req.params;

    Playlist.findByIdAndDelete({_id:id}, (err, deletedItem) => {
        if (err)  return res.status(404).send({message: 'playlist no longer exists!'})
        if (deletedItem){
            res.status(200).send({message: `${deletedItem.name} has been deleted!`})
        }
    })
   return  res.status(500).send({message: 'something went wrong!'})
} 

exports.GET_PLAYLIST_BY_USER = (req, res, next) => {
    const { userId } = req.params;
    
    Playlist.findOne({user:userId}, (err, playlist) => {
        if (err) res.status(404).send({message: 'playlist not found!'})
       return  res.status(200).send({error:false, playlist:playlist});
    })

   return res.status(500).send({message: 'something went wrong!'})

}