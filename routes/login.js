const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../middleware/auth');

router.post('/', function(req, res){
    const { username, password } = req.body;

    User.findOne({username:username},function(err, user){
        if (err) return res.status(500).send({message: err.message})
        // if (!user) return res.status(404).send({message: 'User not found!'})

        if (user && user.comparePassword(password)){
            const token = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            res.status(201).send({
                id: user._id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                balance: user.balance,
                withdraw_balance: user.withdraw_balance,
                accesstoken: token,
                refreshToken: refreshToken
            });
        } else {
            res.status(401).send({
                message: 'Invalid password!',
                accessToken: null,
                refreshToken: null
            });
        }
    });
});

module.exports = router;