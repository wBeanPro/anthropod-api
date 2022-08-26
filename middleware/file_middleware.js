const multer = require('multer');

const multerOptions = {
    limits: {
        fieldsize: 50 * 1024 * 1024
    }
}
const storage = multer.memoryStorage()


const UploadImage = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes('image')){
            cb(null, true)
        } else {
            cb(null, false)
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
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
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
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
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
})

const UploadVideo = multer({
    storage:storage,
    limits: {
        fieldSize:52 * 1024 * 1024
    },
    filter: (req, file, cb) => {
        if (file.mimetype.includes('video') || file.mimetype.includes('image')){
            cb(null, true)
        } else {
            cb(null, false)
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})


module.exports = {
    UploadImage,
    UploadAudio,
    UploadVideo,
    Upload_image_or_audio
}