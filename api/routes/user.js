const express = require('express');
const router = express.Router();
const User = require("../models/user");

//find user
router.get("/:id", (req, res, next) => {
    id = req.params.id;
    User.findById(id)
    .select("-__v")
    .exec()
    .then(docs => {
        if(docs) {
            res.status(200).json(docs);
        } else {
            res.status(404).json({message: "No valid entry found"})
        }        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
});

router.post("/:id/like", (req, res, next) => {
    const id = req.params.id;
    res.status(201).json({
        message: "liked",
    });
});

router.delete("/:id/unlike", (req, res, next) => {
    const id = req.params.id;
    res.status(201).json({
        message: "unliked",
    });
});


module.exports = router;