const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user");

//signup
router.post("/signup", (req, res) => {
    const newEmail = req.body.email.toLowerCase();
    User.find({email: newEmail})
        .exec()
        .then(user => {
             //User.find returns empty array if no user email
            if (user.length >= 1) {
                res.status(409).json({message: "Email already exist"})
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        res.status(500).json({error: err});
                    } else {
                        bcrypt.hash(req.body.password, salt, function(err, hash) {
                            if (err) {
                                res.status(500).json({error: err});
                            } else {
                                const newUser = new User({
                                    username: req.body.username,
                                    email: newEmail,
                                    password: hash
                                });
                                newUser
                                    .save()
                                    .then(() => {
                                        const token = jwt.sign(
                                            {
                                                username: newUser.username,
                                                email: newUser.email,
                                                userId: newUser._id
                                            },
                                            process.env.JWT_KEY,
                                            {
                                                expiresIn: "1h"
                                            }
                                        );
                                        res.status(201).json({
                                            message: "You have successfully signed up",
                                            token: token
                                        });
                                    })
                                    .catch(err =>  {
                                        res.status(500).json({error: err})
                                    });
                            }
                        });
                    }        
                });
            }
        })    
});

//login with JWT
router.post("/login", (req, res) => {
    User.find({email: req.body.email.toLowerCase()})
        .exec()
        .then(foundUser => {            
            if (foundUser.length < 1) {
                return res.status(401).json({message: "Auth failed"});
            }
            console.log(req.body.password);
            console.log(foundUser[0].password);
            bcrypt.compare(req.body.password, foundUser[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({message: "Auth failed"});
                }
                if (result) {
                    const token = jwt.sign(
                        {   
                            username: foundUser[0].username,
                            email: foundUser[0].email,
                            userId: foundUser[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                }
                res.status(401).json({message: "Auth failed"});
            });
        });       
});    

//get all users and sort by most likes
router.get("/most-liked", (req, res) => {
    User.find()
        .select("-password -__v")
        .sort({"likes.likesCount": -1})     
        .exec()
        .then(foundUsers => {
            res.status(200).json(foundUsers);
        })            
        .catch(err => {
            res.status(500).json({error: err})
        });
});

module.exports = router;