const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const bcrypt = require('bcryptjs');
const User = require("../models/user");

//get logged in user info
router.get("/", checkAuth, (req, res, next) => {
    res.status(200).json({
        message: "Currently logged in user infomation",
        userData: req.userData
    });
});

//password update
router.patch("/update-password", checkAuth, (req, res, next) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            res.status(500).json({error: err});
        } else {
            bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
                if (err) {
                    res.status(500).json({error: err});
                } else {
                    User.updateOne({_id: req.userData.userId}, {$set: {password: hash}})
                        .exec()
                        .then(() => {
                            res.status(200).json({message: 'Password updated'});
                        })
                        .catch(err => {
                            res.status(500).json({error: err});
                        })
                }
            });            
        }
    });   
});

module.exports = router;