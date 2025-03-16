const logger = require('/app/common/utils/logger');
const ResponseHandler = require('/app/common/utils/responsHandler');

const errorHandler = (err, req, res, next) => {
  logger.error(`Sipariş Servisi Hatası: ${err.message}`);

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return ResponseHandler.error(res, 'Geçersiz sipariş ID formatı', 400);
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return ResponseHandler.error(res, `Doğrulama hatası: ${messages.join(', ')}`, 400);
  }

  if (err.code === 'ORDER_PROCESSING_ERROR') {
    return ResponseHandler.error(res, 'Sipariş işleme hatası', 400, err.details);
  }

  return ResponseHandler.error(res, 'Bilinmeyen hata', 500);
};

module.exports = errorHandler;

