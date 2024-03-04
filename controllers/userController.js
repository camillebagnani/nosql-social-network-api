const { User } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find() // Finds all the Users in the collection
                .populate({ path: 'thoughts', select: '-__v' }) // Populates the thoughts array with the actual document from the Thought model
                .populate({ path: 'friends', select: '-__v' }) // Populates the friends array with the actual friend documents
                .select('-__v'); // Select method uses '-' to not send back the version, which users don't need
            res.json(users)
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createUser(req, res) {
        try {
            const user = await User.create(req.body); // Create new user using the request body in JSON format
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId }) // Find the user where the id matches the user id in the parameters
                .populate({ path: 'thoughts', select: '-__v' })
                .populate({ path: 'friends', select: '-__v' })
                .select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async updateSingleUser(req, res) {
        try {
            // Finds a user by the id in the parameters and updates it with the request body
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body }, // $set operator replaces the value of the field with the values specified in the request body
                { new: true }
            )
                .populate({ path: 'thoughts', select: '-__v' })
                .populate({ path: 'friends', select: '-__v' })
                .select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }
            res.json(user);
        } catch {
            res.status(500).json({ error: 'Something went wrong.' });
        }
    },
    async deleteSingleUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId }); // Finds user by id in the parameters and deletes them
            res.status(200).json({ message: 'User deleted.' });
            console.log(`Deleted ${user}`);
        } catch (err) {
            res.status(500).json({ error: 'Something went wrong.' });
        }
    },
    async addFriend(req, res) {
        try {
            // Finds user by the id in the parameters 
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } }, // $addToSet operator adds the friend at the friend id in the parameters to the friends array
                { runValidators: true, new: true }
            )
                .populate({ path: 'thoughts', select: '-__v' })
                .populate({ path: 'friends', select: '-__v' })
                .select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json({ error: 'Something went wrong.' });
        }
    },
    async removeFriend(req, res) {
        try {
            // Finds user by the id in the parameters 
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } }, // $pull operator takes the friend id in the parameters to remove that id from the friends array
                { runValidators: true, new: true },
            )
                .select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }
            res.json({ message: 'Friend deleted.' });
        } catch (err) {
            res.status(500).json({ error: 'Something went wrong.' });
        }
    }
};