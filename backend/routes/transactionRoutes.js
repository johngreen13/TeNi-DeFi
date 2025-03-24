const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const transactionSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    transactionHash: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});
});
try {
    module.exports = mongoose.model('Transaction', transactionSchema); actionHash, amount
});
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