const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema({
    _id: Number
});

const friendSchema = new mongoose.Schema({
    _id: Number
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                return /^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z]{2,15})$/.test(value);
            },
            message: input => `${input.value} is not a valid email address!`
        }
    },
    thoughts: [thoughtSchema],
    friends: [friendSchema]
});

const User = mongoose.model('user', userSchema)

module.exports = User;