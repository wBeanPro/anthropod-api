const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');

router.post('/', function(req, res){
    const { username, password, email } = req.body;
    const id = new mongoose.Types.ObjectId().toHexString();

    User.findOne({username:username}, function(err, user){
        if (err) return res.status(401).send({message: err.message});

        if (user)  return res.status(401).send({message: 'Username taken!'})

        const newUser = new User({_id:id, username, password, email})

        newUser.save(function(err, user){
            if (err) return res.status(500).send({messsage:err.message});
            res.status(200).send({message: `${user.id} has successfully been created!`})
        })
    })
})

module.exports = router;