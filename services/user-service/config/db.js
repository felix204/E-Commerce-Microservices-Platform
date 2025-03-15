const mongoose = require('mongoose');
const logger = require('/app/common/utils/logger');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        logger.info('MongoDB Bağlantısı Başarılı');
    } catch (err) {
        logger.error('MongoDB Bağlantı Hatası', err);
        process.exit(1); // Kritik bir hata olduğu için uygulamayı sonlandır
    }
};

module.exports = connectDB;