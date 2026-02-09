// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const voiceRoutes = require('./routes/voice');
const apiRoutes = require('./routes/api');
const billingRoutes = require("./routes/billing");
const chvRoutes = require('./routes/chv');

const app = express();

// ── Dynamic CORS ─────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',                  // local dev (Vite default)
  'http://localhost:3000',                  // if you test locally
  process.env.FRONTEND_URL,                 // ← production frontend URL (from .env)
].filter(Boolean); // remove undefined/null

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-role'],
  credentials: true // if you ever use cookies/auth tokens
}));

// Rest remains unchanged
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/voice', voiceRoutes);
app.use('/api', apiRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/chv", chvRoutes);
app.use("/uploads", express.static("uploads"));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// // backend/server.js (no major changes, but ensure models are imported if needed)
// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
// dotenv.config();

// const voiceRoutes = require('./routes/voice');
// const apiRoutes = require('./routes/api');
// const billingRoutes = require("./routes/billing");
// const chvRoutes = require('./routes/chv');

// const app = express();

// app.use(cors({
//   origin: 'http://localhost:5173', // frontend URL
//   methods: ['GET','POST','PUT','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization','x-api-key', 'x-role']
// }));

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// app.use('/voice', voiceRoutes);
// app.use('/api', apiRoutes);
// app.use("/api/billing", billingRoutes);
// app.use("/api/chv", chvRoutes);
// app.use("/uploads", express.static("uploads"));

// app.get('/health', (req, res) => {
//   res.json({ status: 'ok', time: new Date().toISOString() });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });