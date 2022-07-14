const router = require('express').Router();
const auth = require('../middleware/auth.js');
const User = require('../models/user.js');
const helper = require('../utils/util.js');
const multer = require('multer');

const storage = multer.memoryStorage()

const UploadImage = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes('image')){
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
})

router.get('/', auth.verifyToken, function(req, res, next){
    User.findById({_id:req.userId}, function(err, user){
        if (err) return res.status(500)
        return res.status(200).send({id: user._id, username: user.username, email: user.email})
    })
})

router.put('/:id/upload', [auth.verifyToken, UploadImage.single('avatar')], async(req, res, next) =>{
    const { file } = req;
    try {
        let profile_image_url =  await helper.uploadFile(file);
        User.findByIdAndUpdate(req.params.id, {profile_photo:profile_image_url},{upsert:true},(err, user) =>{
            if (err) res.status(401).send({message: err.message})

            if(!user) res.status(403).send({message: 'User not found!'})

            res.status(200).send({profile_photo: user.profile_photo || null})

        })
    } catch (error) {
        res.status(500).send({message: error.message})
        console.log(error)
    }
})

module.exports = router;