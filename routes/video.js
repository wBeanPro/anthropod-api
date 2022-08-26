const router =  require('express').Router();
const { UploadVideo } = require('../middleware/file_middleware');
const { verifyToken } = require('../middleware/auth.js');
const VideoController = require('../controllers/video');

router.post('/upload', [verifyToken,UploadVideo.fields([{name:'video', maxCount:1}, {name: 'thumbnail', maxCount:1}])],VideoController.CREATE_VIDEO);
router.put('/:id/edit', UploadVideo.fields([{name:'video', maxCount:1}, {name: 'thumbnail', maxCount:1}]), VideoController.UPDATE_VIDEO);
router.get('/all_videos', VideoController.GET_ALL_VIDEOS);
router.delete('/:id', VideoController.DELETE_VIDEO)

module.exports = router;