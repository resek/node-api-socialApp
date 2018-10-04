const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const meRoutes = require("./api/routes/me");
const userRoutes = require("./api/routes/user");
const indexRoutes = require("./api/routes/index");

mongoose.connect(`mongodb://resek:${process.env.MONGO_ATLAS_PW}@cluster0-shard-00-00-5r5fe.mongodb.net:27017,cluster0-shard-00-01-5r5fe.mongodb.net:27017,cluster0-shard-00-02-5r5fe.mongodb.net:27017/socialApp?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`, { useNewUrlParser: true, useCreateIndex: true });

//app config
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS protection - set response header to allow CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // * all origin
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    //for browser options request - allways first in request
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

//routes which should handle requests
app.use("/me", meRoutes);
app.use("/user", userRoutes);
app.use(indexRoutes);

//error handling - not defined route
app.use((req, res, next) => {
    const error = new Error('Not found route');
    error.status = 404;
    next(error);
})

//not defined routes + errors from DB
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

//server config
app.listen(process.env.PORT || 3000, () => console.log("Server has started!"))