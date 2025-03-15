const express = require('express');
const cors = require('cors');
require('dotenv').config();
const logger = require('/app/common/utils/logger');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const productRoutes = require('./routes/productRoutes');

// Express uygulamasını başlat
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB'ye bağlan
connectDB();

// Rotalar
app.use('/api/products', productRoutes);

// Hata yakalama middleware - tüm route'lardan sonra tanımlanmalı
app.use(errorHandler);

// Sunucuyu başlat
app.listen(PORT, () => {
    logger.info(`Ürün Servisi ${PORT} portunda çalışıyor`);
}); 