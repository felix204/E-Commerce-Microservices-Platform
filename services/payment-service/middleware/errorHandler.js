const logger = require('/app/common/utils/logger');
const ResponseHandler = require('/app/common/utils/responsHandler');

/**
 * Payment servisi için özelleştirilmiş hata yönetimi middleware'i
 * Sadece ödeme işlemleri sırasında oluşabilecek hataları ele alır
 */
const errorHandler = (err, req, res, next) => {
    // Hatayı logla
    logger.error(`Ödeme Servisi Hatası: ${err.message}`);
    
    // genellikle geçersiz ID formatı
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return ResponseHandler.error(res, 'Geçersiz ödeme ID formatı', 400);
    }
    
    // şema doğrulama hatası
    if (err.name === 'ValidationError') {
        // Hata mesajlarını topla
        const messages = Object.values(err.errors).map(val => val.message);
        return ResponseHandler.error(res, `Doğrulama hatası: ${messages.join(', ')}`, 400);
    }
    
    // Ödeme işlemi hatası
    if (err.code === 'PAYMENT_PROCESSING_ERROR') {
        return ResponseHandler.error(res, 'Ödeme işlemi sırasında bir hata oluştu', 400, err.details);
    }
    
    // Yetersiz bakiye hatası
    if (err.code === 'INSUFFICIENT_FUNDS') {
        return ResponseHandler.error(res, 'Yetersiz bakiye', 400);
    }
    
    // Kart hatası
    if (err.code === 'CARD_ERROR') {
        return ResponseHandler.error(res, 'Kart işlemi reddedildi', 400, err.details);
    }
    
    // Genel sunucu hatası
    const errorDetails = process.env.NODE_ENV === 'production' ? null : err.stack;
    ResponseHandler.error(res, 'Ödeme işlemi sırasında bir hata oluştu', 500, errorDetails);
};

module.exports = errorHandler;
