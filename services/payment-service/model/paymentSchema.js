const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Ödeme miktarı gereklidir'],
    min: [0, 'Ödeme miktarı sıfırdan büyük olmalıdır'],
  },
  currency: {
    type: String,
    default: 'TRY',
    required: [true, 'Para birimi gereklidir'],
    enum: ["USD", "EUR", "TRY"],
  },
  paymentMethod: {
    type: String,
    required: [true, 'Ödeme yöntemi gereklidir'],
    enum: ["credit-card", "debit-card", "bank-transfer", "mobile-payment"],
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentDetails: {
    cardNumber: {
      type: String,
      // Sadece son 4 haneyi saklıyoruz, güvenlik için
      validate: {
        validator: function (v) {
          return v.length === 4;
        },
        message: 'Kart numarası son 4 hanesi saklanmalıdır'
      }
    },
    cardType: {
      type: String,
      enum: ['visa', 'mastercard', 'amex', 'troy', null]
    },
    bankName: String,
    transactionId: String
  },
  billingAddress: {
    fullName: String,
    addressLine: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },
  errorMessage: {
    type: String,
    default: null
  },
  refundReason: {
    type: String,
    default: null
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

module.exports = paymentSchema; 