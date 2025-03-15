const express = require('express');
const router = express.Router();
const PaymentController = require('../controller/paymentController');

/**
 * @route POST /api/payments
 * @desc Yeni ödeme oluştur
 * @access Public
 */
router.post('/', PaymentController.createPayment);

/**
 * @route GET /api/payments/:id
 * @desc ID'ye göre ödeme getir
 * @access Public
 */
router.get('/:id', PaymentController.getPaymentById);

/**
 * @route GET /api/payments/order/:orderId
 * @desc Sipariş ID'sine göre ödemeleri getir
 * @access Public
 */
router.get('/order/:orderId', PaymentController.getPaymentsByOrderId);

/**
 * @route GET /api/payments/user/:userId
 * @desc Kullanıcı ID'sine göre ödemeleri getir
 * @access Public
 */
router.get('/user/:userId', PaymentController.getPaymentsByUserId);

/**
 * @route PUT /api/payments/:id/cancel
 * @desc Ödemeyi iptal et
 * @access Public
 */
router.put('/:id/cancel', PaymentController.cancelPayment);

/**
 * @route PUT /api/payments/:id/refund
 * @desc Ödemeyi iade et
 * @access Public
 */
router.put('/:id/refund', PaymentController.refundPayment);

module.exports = router;
