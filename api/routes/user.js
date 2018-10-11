const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const User = require("../models/user");

//find user
router.get("/:id", (req, res) => {
    User.findById(req.params.id)
        .select("-__v -password")
        .exec()
        .then(foundUser => {
            res.status(200).json(foundUser);       
        })
        .catch(err => {res.status(500).json({error: err});
        });        
});

//like user
router.patch("/:id/like", checkAuth, (req, res) => {
    User.findById(req.params.id)
        .exec()
        .then(foundUser => {
            const idsArr = foundUser.likes.idsArr;
            const logInUserId = req.userData.userId;
            if (idsArr.includes(logInUserId)) {
                res.status(403).json({
                    message: `You can't like ${foundUser.username} twice`
                });
            } else if (logInUserId == foundUser._id) {
                res.status(403).json({
                    message: "You can not like youself"
                });
            } else {
                idsArr.push(logInUserId);
                foundUser.likes.likesCount = idsArr.length;
                foundUser.save();
                res.status(200).json({
                    messege: `You have liked ${foundUser.username}`
                });
            }        
        })
        .catch(err => {res.status(500).json({error: err});
        });        
});

//unlike user
router.patch("/:id/unlike", checkAuth, (req, res) => {
    User.findById(req.params.id)
        .exec()
        .then(foundUser => {
            const idsArr = foundUser.likes.idsArr;
            const index = idsArr.indexOf(req.userData.userId);
            if (index > -1)  {
                idsArr.splice(index, 1);
                foundUser.likes.likesCount = idsArr.length;
                foundUser.save();
                res.status(200).json({
                    message: `You have unliked ${foundUser.username}`
                });
            } else {            
                res.status(403).json({
                    message: `You have not liked ${foundUser.username} before`
                });
            } 
        })
        .catch(err => {res.status(500).json({error: err});
        });
});

module.exports = router;