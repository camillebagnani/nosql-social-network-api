const {Schema, model} = require('mongoose');

// Schema that makes a user
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
        // Validates the user enters a valid email address using regular expression
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
            ref: 'thought', // References the idea from the Thought model
        },
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user', // Self-references to get number of friends
        },
    ],
},
{
    toJSON: {
        virtuals: true
    },
    id: false
}
);

// Creates a virtual property that returns the length of the friends array
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
})

const User = model('user', userSchema);

module.exports = User;