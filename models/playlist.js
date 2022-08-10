const mongoose = require('mongoose');
const User = require('./user.js');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    name: { type: String, required: true},
    songs: [{type: Schema.Types.ObjectId, ref: 'Songs', default: []}],
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    image: { type: String, default: 'https://images.unsplash.com/photo-1483032469466-b937c425697b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjR8fG11c2ljJTIwbm90ZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60' },
    createOn: { type: Date, default: Date.now()}
})

module.exports =  mongoose.model('Playlists', PlaylistSchema);