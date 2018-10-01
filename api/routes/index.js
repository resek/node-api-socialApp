const express = require('express');
const router = express.Router();
const User = require("../models/user");

//signup
router.post("/signup", (req, res, next) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });
    user
    .save()
    .then(result => {
        res.status(201).json({
            message: "You have successfully signed up",
            newUser: {
                username: result.username,
                email: result.email,
                _id: result._id,
                request: {
                    type: "GET",
                    url: process.env.USER_URL + result._id
                }
            }
        });
    })
    .catch(err =>  {
        res.status(500).json({error: err})
    });    
});

router.post("/login", (req, res, next) => {
    res.status(201).json({
        message: "logedin",
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