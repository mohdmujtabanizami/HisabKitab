require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Ledger = require('./models/Ledger');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("✅ MongoDB Connected");
}).catch(err => console.log(err));

app.get('/api/sync/:email', async (req, res) => {
    try {
        const queryEmail = req.params.email.trim();
        const ledger = await Ledger.findOne({ 
            email: { $regex: new RegExp("^" + queryEmail + "$", "i") } 
        });
        res.json(ledger ? { success: true, data: ledger.data } : { success: false, message: "No backup found" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/sync', async (req, res) => {
    try {
        const { email, data } = req.body;
        await Ledger.findOneAndUpdate(
            { email },
            { data, lastSynced: Date.now() },
            { upsert: true, returnDocument: 'after' }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));