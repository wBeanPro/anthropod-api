const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');
const { uploadFile } = require('../utils/util.js');
const { UploadImage } = require('../middleware/file_middleware');

router.post('/', UploadImage.single('profileImage') ,async function(req, res){
    const { username, password, email, firstname,  lastname } = req.body;
    const id = new mongoose.Types.ObjectId().toHexString();
    const profileImage = req.file;
    const user_profile_image = await uploadFile(profileImage)

    User.findOne({username:username}, function(err, user){
        if (err) return res.status(401).send({message: err.message});

        if (user)  return res.status(401).send({message: 'Username taken!'})

        const newUser = new User({_id:id, username, email, password, firstname, lastname,  profile_photo: user_profile_image || ''})

        newUser.save(function(err, user){
            if (err) return res.status(500).send({messsage:err.message});
            res.status(200).send({message: `${user.id} has successfully been created!`})
        })
    })
})

module.exports = router;