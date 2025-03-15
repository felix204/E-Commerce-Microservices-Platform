const mongoose = require('mongoose');
const paymentSchema = require('./paymentSchema');
const addPaymentMethods = require('./paymentMethods');
const addPaymentStatics = require('./paymentStatics');
const addPaymentMiddleware = require('./paymentMiddleware');
const addPaymentVirtuals = require('./paymentVirtuals');

// Şemaya metotları, statik fonksiyonları, middleware'leri ve sanal alanları ekle
addPaymentMethods(paymentSchema);
addPaymentStatics(paymentSchema);
addPaymentMiddleware(paymentSchema);
addPaymentVirtuals(paymentSchema);

// Şemadan modeli oluştur
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 