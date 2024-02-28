const {Schema, model} = require('mongoose');

// const thoughtSchema = new mongoose.Schema({
//     _id: Number
// });

const userSchema = new Schema({
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
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'thought',
        },
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    ],
});

userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
})

const User = model('user', userSchema);

module.exports = User;