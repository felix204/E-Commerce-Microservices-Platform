const logger = require('/app/common/utils/logger');
const ResponseHandler = require('/app/common/utils/responsHandler');

/**
 * Product servisi için özelleştirilmiş hata yönetimi middleware'i
 * Sadece ürün işlemleri sırasında oluşabilecek hataları ele alır
 */
const errorHandler = (err, req, res, next) => {
    // Hatayı logla
    logger.error(`Ürün Servisi Hatası: ${err.message}`);
    
    // MongoDB CastError hatası (genellikle geçersiz ID formatı)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return ResponseHandler.error(res, 'Geçersiz ürün ID formatı', 400);
    }
    
    // MongoDB ValidationError hatası (şema doğrulama hatası)
    if (err.name === 'ValidationError') {
        // Hata mesajlarını topla
        const messages = Object.values(err.errors).map(val => val.message);
        return ResponseHandler.error(res, `Doğrulama hatası: ${messages.join(', ')}`, 400);
    }
    
    // Genel sunucu hatası
    const errorDetails = process.env.NODE_ENV === 'production' ? null : err.stack;
    ResponseHandler.error(res, 'Ürün işlemi sırasında bir hata oluştu', 500, errorDetails);
};

module.exports = errorHandler;
