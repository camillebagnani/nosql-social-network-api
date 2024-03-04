const { Thought, User } = require('../models');

module.exports = {

    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find() // Finds all documents in a collection
            .select('-__v'); // Select method uses '-' to not send back the version, which users don't need
            res.json(thoughts); // Sends back JSON of the thoughts
        } catch (err) {
            res.status(500).json(err); // Error handling sends back error if API fails
        }
    },
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body); // Create a new thought using the request body
            // Find the associated user and add the created thought to the thoughts array of the User model
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId }, // Finds user by the user id in the request body
                { $addToSet: { thoughts: thought._id } }, // Uses the $addToSet operator to add the value of the thought at that id to the array
                { new: true } // Show the new JSON when created
            );

            // Error handling
            if (!user) {
                return res.status(404).json({
                    message: 'Thought created, but found no user with that ID',
                });
            }

            res.json(thought); // Return the new thought

        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId }) // Uses findOne method to a thought by the id in the parameters
                .select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);

        } catch (err) {
            res.status(500).json(err);
        }
    },
    async updateThought(req, res) {
        try {
            // Find and updates a thought by the id sent in the parameters and uses $set operator to update whatever is sent in the request body
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body }, // $set operator replaces the value of the field with the values specified in the request body
                { runValidators: true, new: true }, // Updates validators and shows updated JSON once completed
            )
            .select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought)
        } catch (err) {
            res.status(500).json({ error: 'Something went wrong.' });
        }
    },
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId }); // Deletes thought that matches the id in the parameters
            // If the request body has a userId, find that User so we can delete the targeted thought from the user's thoughts array
            if(req.body.userId) {
                const user = await User.findOneAndUpdate(
                    {_id: req.body.userId},
                    {$pull: {thoughts: thought._id}}) // $pull operator removes the thought of the id in the parameters from the user's thought array
            }
            res.status(200).json({ message: 'Thought deleted.' });
            console.log(`Deleted ${thought}`);
        } catch (err) {
            res.status(500).json({ error: 'Something went wrong.' });
        }
    },
    async createReaction(req, res) {
        try {
            // Update the thought where the id matches the id in the parameters
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } }, // Adds the reaction from the request body to that thought's reaction array
                { runValidators: true, new: true }
            )
            .select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json({ error: 'Something went wrong.' });
        }
    },
    async deleteReaction(req, res) {
        try {
            // Deletes the reaction from the thought where the thought id matches the id in the parameters
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.body.reactionId } } }, // Remove the reaction where the reaction id matches the id request body
                { runValidators: true, new: true }
            )
            .select('-__v');
            
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json({ error: 'Something went wrong.' });
        }
    }
}