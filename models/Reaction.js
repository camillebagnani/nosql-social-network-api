const { Schema, Types } = require('mongoose')

// Schema for what makes a reaction
const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        max: 280
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: timestamp => new Date(timestamp).toLocaleString()
    },
},
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false,
        timestamps: true
    },
);

module.exports = reactionSchema;