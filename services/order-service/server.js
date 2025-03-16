const express = require('express');
const cors = require('cors');
const logger = require('/app/common/utils/logger');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB'ye bağlan
connectDB();

// Rotalar
app.use('/api/orders', orderRoutes);

// Hata yakalama middleware
app.use(errorHandler);

// Sunucuyu başlat
app.listen(PORT, () => {
    logger.info(`Sipariş Servisi ${PORT} portunda çalışıyor`);
});
