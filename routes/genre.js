const router = require('express').Router();
const genreController = require('../controllers/genre');

router.get('/all_genres', genreController.GET_ALL_GENRES);
router.post('/', genreController.CREATE_GENRE);

module.exports = router;