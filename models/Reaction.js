const { Schema, Types } = require('mongoose')

const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        //QUESTION ** add default value set to a new ObjectId
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
    //QUESTION 
    createdAt: {
        type: Date,
        default: Date.now(),
        timestamps: true,
    },
},
    {
        toJSON: {
            // getters: true,
            virtuals: true
        },
        id: false
    },
);

module.exports = reactionSchema;