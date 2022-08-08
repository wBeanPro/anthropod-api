const Genre = require('../models/genre');
const mongoose = require('mongoose');

exports.GET_ALL_GENRES = (req, res, next) => {
    Genre.find({}, (err, genres) => {
        if (err) return res.status(500).send({isSucces: false, genres:[]})
        else if(genres && genres.length > 0){
            return res.status(200).send({isSucess: true, genres: genres})
        } else {
            return res.status(400).send({isSucces: false,message: 'no genres exist' ,genres:[]})
    }
    })
}

exports.CREATE_GENRE = async(req, res, next) => {
    const { name} = req.body;

    let newGenre = new Genre({
        _id: new mongoose.Types.ObjectId().toHexString(),
        name: name
    })

    newGenre.save((err, genre) => {
        if (err) res.status(500).send({isSuccess:false, message: 'could not save genre!'})
        if (genre) res.status(200).send({isSuccess:true, message: `new ${genre.id} for ${genre.name}`})
    })

}