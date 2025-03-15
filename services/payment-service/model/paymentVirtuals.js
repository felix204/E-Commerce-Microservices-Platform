/**
 * Ödeme modeli için sanal alanlar
 * @param {Object} schema - Mongoose şeması
 */
const addPaymentVirtuals = (schema) => {
  // Ödeme özeti için sanal alan
  schema.virtual('summary').get(function () {
    return {
      id: this._id,
      orderId: this.orderId,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      method: this.paymentMethod,
      date: this.createdAt
    };
  });
  
  // Ödeme durumu için sanal alan
  schema.virtual('statusText').get(function () {
    const statusMap = {
      'pending': 'Beklemede',
      'processing': 'İşleniyor',
      'completed': 'Tamamlandı',
      'failed': 'Başarısız',
      'refunded': 'İade Edildi',
      'cancelled': 'İptal Edildi'
    };
    
    return statusMap[this.status] || this.status;
  });
  
  // Ödeme yöntemi için sanal alan
  schema.virtual('paymentMethodText').get(function () {
    const methodMap = {
      'credit-card': 'Kredi Kartı',
      'debit-card': 'Banka Kartı',
      'bank-transfer': 'Banka Havalesi',
      'mobile-payment': 'Mobil Ödeme'
    };
    
    return methodMap[this.paymentMethod] || this.paymentMethod;
  });
};

module.exports = addPaymentVirtuals; 