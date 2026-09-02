const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    data: { type: Object, default: {} },
    lastSynced: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ledger', ledgerSchema);