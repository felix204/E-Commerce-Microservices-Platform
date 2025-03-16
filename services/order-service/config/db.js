const mongoose = require('mongoose');
const logger = require('/app/common/utils/logger');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info('MongoDB Bağlantısı Başarılı');
    } catch (err) {
        logger.error('MongoDB Bağlantı Hatası', err);
        process.exit(1);
    }
};

module.exports = connectDB;

