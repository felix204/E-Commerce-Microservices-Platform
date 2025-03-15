/**
 * Ödeme modeli için middleware fonksiyonları
 * @param {Object} schema - Mongoose şeması
 */
const addPaymentMiddleware = (schema) => {
  // Ödeme güncellendiğinde updatedAt alanını otomatik güncelle
  schema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
  });

  // Ödeme tamamlandığında completedAt alanını güncelle
  schema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
      this.completedAt = Date.now();
    }
    next();
  });
  
  // Ödeme iptal edildiğinde veya iade edildiğinde kontrol
  schema.pre('save', function (next) {
    if (this.isModified('status')) {
      if (this.status === 'cancelled' && !this.refundReason) {
        this.refundReason = 'İptal edildi';
      }
      
      if (this.status === 'refunded' && !this.refundReason) {
        this.refundReason = 'İade edildi';
      }
    }
    next();
  });
};

module.exports = addPaymentMiddleware; 