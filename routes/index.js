
const router = require('express').Router();
const registerRoute = require('./register.js');
const loginRoute = require('./login.js');
const userRoute = require('./user.js');
const songRoute = require('./song.js');


router.use('/register', registerRoute);
router.use('/login', loginRoute);
router.use('/profile', userRoute);
router.use('/song', songRoute);


module.exports = router;