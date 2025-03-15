/**
 * Ödeme modeli için statik metotlar
 * @param {Object} schema - Mongoose şeması
 */
const addPaymentStatics = (schema) => {
  // Ödeme ID'sine göre arama için statik metot
  schema.statics.findByOrderId = function (orderId) {
    return this.find({ orderId });
  };

  // Kullanıcının ödemelerini bulmak için statik metot
  schema.statics.findByUserId = function (userId) {
    return this.find({ userId });
  };
  
  // Belirli bir duruma sahip ödemeleri bulmak için statik metot
  schema.statics.findByStatus = function (status) {
    return this.find({ status });
  };
  
  // Belirli bir tarih aralığındaki ödemeleri bulmak için statik metot
  schema.statics.findByDateRange = function (startDate, endDate) {
    return this.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    });
  };
};

module.exports = addPaymentStatics; 