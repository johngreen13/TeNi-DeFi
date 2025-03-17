const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    transactionHash: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);