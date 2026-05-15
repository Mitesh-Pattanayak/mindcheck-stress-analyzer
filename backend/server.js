const express = require('express');
const mongoose = require('mongoose');
const cors    = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:4200' }));
app.use(express.json());

// ── Database ────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindcheck';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected:', MONGO_URI))
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api', require('./routes/api'));

// 404 fallback
app.use((_, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// ── Listen ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running → http://localhost:${PORT}`));
