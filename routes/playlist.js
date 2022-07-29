const router = require('express').Router();
const { UploadImage } = require('../middleware/file_middleware');
const Playlist_controller = require('../controllers/playlist');





router.get('/:id', Playlist_controller.GET_PLAYLIST_BY_ID);
router.get('/user/:userId', Playlist_controller.GET_PLAYLIST_BY_USER);
router.post('/create_playlist', Playlist_controller.CREATE_PLAYLIST);
router.put('/:id/edit', UploadImage.single('cover') ,Playlist_controller.UPDATE_PLAYLIST);
router.put('/:id/editImage',UploadImage.single('cover'), Playlist_controller.UPDATE_IMAGE);
router.put('/:id/add_to_playlist', Playlist_controller.ADD_SONG_TO_PLAYLIST);
router.put('/:id/remove/:songId',Playlist_controller.REMOVE_SONG_FROM_PLAYLIST);
router.delete('/:id', Playlist_controller.DELETE_PLAYLIST);

module.exports = router;