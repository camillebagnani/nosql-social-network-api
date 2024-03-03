const { User } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find()
                .populate({ path: 'thoughts', select: '-__v' })
                .populate({ path: 'friends', select: '-__v' })
                .select('-__v');
            res.json(users)
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
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
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
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
            const user = await User.findOneAndDelete({ _id: req.params.userId });
            res.status(200).json({ message: 'User deleted.' });
            console.log(`Deleted ${user}`);
        } catch (err) {
            res.status(500).json({ error: 'Something went wrong.' });
        }
    },
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
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
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
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