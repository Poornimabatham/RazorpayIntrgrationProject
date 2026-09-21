const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
app.use(cors());

// Raw body needed for webhook signature verification
app.use('/api/payment/Paymentwebhook', express.raw({ type: 'application/json' }));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => res.send('API Running'));

app.listen(process.env.PORT || 5000, () => console.log('Server started'));
