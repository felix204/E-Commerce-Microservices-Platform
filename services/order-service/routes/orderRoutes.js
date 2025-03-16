const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const authMiddleware = require('/app/common/middleware/auth');

// Sipariş oluştur
router.post('/', authMiddleware, OrderController.createOrder);

// Tüm siparişleri getir (filtreleme seçenekleriyle)
router.get('/', authMiddleware, OrderController.getAllOrders);

// Sipariş detayını getir
router.get('/:orderId', authMiddleware, OrderController.getOrderById);

// Sipariş durumunu güncelle
router.put('/:orderId/status', authMiddleware, OrderController.updateOrderStatus);

// Siparişi sil
router.delete('/:orderId', authMiddleware, OrderController.deleteOrder);

// Kullanıcının siparişlerini getir
router.get('/user/:userId', authMiddleware, OrderController.getUserOrders);

module.exports = router;
