const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    _id: {type:mongoose.Types.ObjectId},
    name: { type: String, required:true, max:500, unique:true}
})

module.exports = mongoose.model('Genres', GenreSchema);