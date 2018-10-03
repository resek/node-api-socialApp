const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: { type: String, required: true, maxlength: 256 },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        maxlength: 256,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ 
    },
    password: {type: String, required: true, maxlength: 256 }
});

module.exports = mongoose.model('User', userSchema);