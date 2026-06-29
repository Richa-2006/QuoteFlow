const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));

app.get('/', (req, res) => res.json({ message: 'QuoteFlow API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
