const router = require('express').Router();
const { tokenRefresh } = require('../middleware/auth');

router.post('/', tokenRefresh, (req, res) => {
    res.send({
        accessToken: req.token,
        resfreshToken:req.refreshToken
    });
});

module.exports = router;