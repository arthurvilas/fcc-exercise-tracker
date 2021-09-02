const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0,
        required: true
    },
    log: [
        {
            description: String, 
            duration: Number,
            date: String,
            _id: false
        }
    ]
});

module.exports = mongoose.model('Users', UserSchema);