const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user");

//signup
router.post("/signup", (req, res, next) => {
    const newEmail = req.body.email.toLowerCase();
    User.find({email: newEmail})
        .exec()
        .then(user => {
             //User.find returns empty array if no user email
            if (user.length >= 1) {
                res.status(409).json({message: "Email already exist!"})
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
                                        res.status(201).json({
                                            message: "You have successfully signed up",
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
router.post("/login", (req, res, next) => {
    User.find({email: req.body.email.toLowerCase()})
        .exec()
        .then(foundUser => {            
            if (foundUser.length < 1) {
                return res.status(401).json({message: "Auth failed"});
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({message: "Auth failed"});
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: foundUser[0].email,
                            userId: foundUser[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "12h"
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

//get all users and sort by likes
router.get("/most-liked", (req, res, next) => {
    User.find()
    .select("username email _id")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            users: docs.map(doc => {
                return {
                    username: doc.username,
                    email: doc.email,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: process.env.USER_URL + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({error: err})
    });
});

module.exports = router;