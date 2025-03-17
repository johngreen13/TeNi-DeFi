const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Create or update a user
router.post('/', async (req, res) => {
    const { walletAddress } = req.body;

    try {
        let user = await User.findOne({ walletAddress });
        if (!user) {
            user = new User({ walletAddress });
            await user.save();
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error saving user' });
    }
});

module.exports = router;