const router = require('express').Router();
const ArtController = require('../controllers/art');
const { UploadImage } = require('../middleware/file_middleware');
const {verifyToken} = require('../middleware/auth');

router.get('/', ArtController.GET_ALL_ART);
router.post('/upload', [verifyToken,UploadImage.single('image')],ArtController.CREATE_ART);
router.put('/:id/edit',[verifyToken, UploadImage.single('image')], ArtController.UPDATE_ART);
router.delete('/:id', [verifyToken],ArtController.DELETE_ART);


module.exports = router;

