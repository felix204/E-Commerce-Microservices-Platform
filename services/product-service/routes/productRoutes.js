const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Tüm ürünleri getir
router.get('/', ProductController.getAllProducts);

// ID'ye göre ürün getir
router.get('/:id', ProductController.getProductById);

// Yeni ürün oluştur
router.post('/', ProductController.createProduct);

// Ürün güncelle
router.put('/:id', ProductController.updateProduct);

// Ürün sil
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;
