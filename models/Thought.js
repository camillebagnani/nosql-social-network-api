const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        min: 1,
        max: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: timestamp => new Date(timestamp).toLocaleString()
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema]
},
// Options for the document
{
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
    timestamps: true
}
);

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
})

const Thought = model('thought', thoughtSchema);

module.exports = Thought;