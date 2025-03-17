const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Add a transaction
router.post('/', async (req, res) => {
    const { walletAddress, transactionHash, amount } = req.body;

    try {
        const transaction = new Transaction({ walletAddress, transactionHash, amount });
        await transaction.save();
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Error saving transaction' });
    }
});

// Get transactions for a user
router.get('/:walletAddress', async (req, res) => {
    const { walletAddress } = req.params;

    try {
        const transactions = await Transaction.find({ walletAddress });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transactions' });
    }
});

module.exports = router;