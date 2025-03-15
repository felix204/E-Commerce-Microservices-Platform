/**
 * Ödeme modeli için instance metotları
 * @param {Object} schema - Mongoose şeması
 */
const addPaymentMethods = (schema) => {
  // Ödeme durumunu kontrol etmek için yardımcı metotlar
  schema.methods.isCompleted = function () {
    return this.status === 'completed';
  };

  schema.methods.isFailed = function () {
    return this.status === 'failed';
  };

  schema.methods.isPending = function () {
    return this.status === 'pending' || this.status === 'processing';
  };

  schema.methods.canBeRefunded = function () {
    return this.status === 'completed' &&
      (new Date() - this.completedAt) < (30 * 24 * 60 * 60 * 1000); // 30 gün içinde
  };
};

module.exports = addPaymentMethods; 