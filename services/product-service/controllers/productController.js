const Product = require('../models/productModel');
const ResponseHandler = require('/app/common/utils/responsHandler');

/**
 * Ürün işlemlerini yöneten controller sınıfı
 */
class ProductController {

  /**
   * Yeni ürün oluşturma
   * @route POST /api/products
   */
  static async createProduct(req, res, next) {
    try {
      const { name, description, price, stock, category } = req.body;

      // Veri doğrulama işlemleri burada yapılabilir
      if (price <= 0) {
        return ResponseHandler.error(res, 'Ürün fiyatı sıfırdan büyük olmalıdır', 400);
      }

      if (stock < 0) {
        return ResponseHandler.error(res, 'Stok miktarı negatif olamaz', 400);
      }

      const product = new Product({ name, description, price, stock, category });
      await product.save();

      ResponseHandler.success(res, { product }, 201);
    } catch (error) {
      next(error); // Hatayı middleware'e ilet
    }
  }

  /**
   * Tüm ürünleri getirme
   * @route GET /api/products
   */
  static async getAllProducts(req, res, next) {
    try {
      const products = await Product.find();
      ResponseHandler.success(res, { products }, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * ID'ye göre ürün getirme
   * @route GET /api/products/:id
   */
  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return ResponseHandler.error(res, 'Ürün bulunamadı', 404);
      }

      ResponseHandler.success(res, { product }, 200);
    } catch (error) {
      // CastError hatası error handler tarafından yakalanacak
      next(error);
    }
  }

  /**
   * Ürün güncelleme
   * @route PUT /api/products/:id
   */
  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, price, stock, category } = req.body;

      // Veri doğrulama işlemleri
      if (price && price <= 0) {
        return ResponseHandler.error(res, 'Ürün fiyatı sıfırdan büyük olmalıdır', 400);
      }

      if (stock !== undefined && stock < 0) {
        return ResponseHandler.error(res, 'Stok miktarı negatif olamaz', 400);
      }

      // Sadece gönderilen alanları güncelle
      const updateData = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (price) updateData.price = price;
      if (stock !== undefined) updateData.stock = stock;
      if (category) updateData.category = category;

      const product = await Product.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      );

      if (!product) {
        return ResponseHandler.error(res, 'Ürün bulunamadı', 404);
      }

      ResponseHandler.success(res, { product }, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Ürün silme
   * @route DELETE /api/products/:id
   */
  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return ResponseHandler.error(res, 'Ürün bulunamadı', 404);
      }

      ResponseHandler.success(res, { message: 'Ürün başarıyla silindi' }, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;