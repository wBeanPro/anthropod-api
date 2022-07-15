const router = require('express').Router();
const songController = require('../controllers/song.js');
const { Upload_image_or_audio } = require('../middleware/file_middleware');
const { verifyToken } = require('../middleware/auth.js');


router.get('/', songController.get_all_songs);
router.post('/' ,[verifyToken, Upload_image_or_audio.fields([{name:'cover', maxCount: 1}, {name:'song', maxCount:1}])], songController.create_song)

module.exports = router;