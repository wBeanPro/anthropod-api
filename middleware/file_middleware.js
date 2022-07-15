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

const UploadAudio = multer({
    storage:storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes('audio')){
            cb(null, true)
        } else {
            cb(null, false);
        }
    }

})

const Upload_image_or_audio = multer({
    storage:storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype.includes('audio') ||
            file.mimetype.includes('image')
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
})


module.exports = {
    UploadImage,
    UploadAudio,
    Upload_image_or_audio
}