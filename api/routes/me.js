const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {

    res.status(200).json({
        message: "Currently logged in user infomation"
    });
});

router.patch("/update-password", (req, res, next) => {
    res.status(201).json({
        message: "update-password logic"
    });
});

module.exports = router;