const { Schema, model } = require('mongoose');

const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        //add default value set to a new ObjectId
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
        default: Date.now(),
        timestamps: true,
        toJSON: {
            getters: true,
            virtuals: true
        },
    }
})

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        min: 1,
        max: 280
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        timestamps: true,
        toJSON: {
            getters: true,
            virtuals: true
        },
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema]
});

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
})

const Thought = model('thought', thoughtSchema);

module.exports = Thought;