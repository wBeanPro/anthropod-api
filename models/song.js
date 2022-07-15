const mongoose =  require('mongoose');
const User = require('./user.js');

const Schema = mongoose.Schema;

const SongSchema = new Schema({
    _id: {type: mongoose.Types.ObjectId},
    title: { type: String, required: true},
    likes: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    fileUrl: {type: String, required: true},
    coverUrl: {type: String, required: true},
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    releaseDate: { type: Date, default: Date.now},
    createdOn: { type: Date, default: Date.now}
})


module.exports = mongoose.model('Songs', SongSchema);