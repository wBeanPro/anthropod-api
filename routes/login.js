const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', function(req, res){
    const { username, password } = req.body;

    User.findOne({username:username},function(err, user){
        if (err) return res.status(500).send({message: err.message})
        if (!user) return res.status(404).send({message: 'User not found!'})

        if (user && user.comparePassword(password)){
            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
                expiresIn: 86400
            });

            res.status(201).send({
                id: user._id,
                username: user.username,
                email: user.email,
                accesstoken: token      
            });
        } else {
            res.status(401).send({
                message: 'Invalid password!',
                accessToken: null
            });
        }
    });
});

module.exports = router;