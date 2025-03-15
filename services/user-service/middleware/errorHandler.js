const logger = require('/app/common/utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Sunucu hatası',
        error: process.env.NODE_ENV === 'production' ? {} : err.stack
    });
};

module.exports = errorHandler; 