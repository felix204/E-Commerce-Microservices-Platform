const express = require('express');
const cors = require('cors');
const logger = require('/app/common/utils/logger');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');

// Express uygulamasını başlat
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB'ye bağlan
connectDB();

// Rotalar
app.use('/api/users', userRoutes);

// Hata yakalama middleware
app.use(errorHandler);

// Sunucuyu başlat
app.listen(PORT, () => {
    logger.info(`Kullanıcı Servisi ${PORT} portunda çalışıyor`);
});

