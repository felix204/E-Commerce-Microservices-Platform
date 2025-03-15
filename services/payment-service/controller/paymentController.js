const Payment = require('../model');
const logger = require('/app/common/utils/logger');
const ResponseHandler = require('/app/common/utils/responsHandler');

/**
 * Ödeme işlemlerini yöneten controller sınıfı
 */
class PaymentController {
  /**
   * Yeni ödeme oluşturma
   * @route POST /api/payments
   */
  static async createPayment(req, res, next) {
    try {
      const { orderId, userId, amount, currency, paymentMethod, paymentDetails, billingAddress } = req.body;

      // Veri doğrulama işlemleri
      if (amount <= 0) {
        return ResponseHandler.error(res, 'Ödeme tutarı sıfırdan büyük olmalıdır', 400);
      }

      // Ödeme işlemi simülasyonu
      const isSuccessful = Math.random() > 0.2; // %80 başarı oranı
      
      const payment = new Payment({
        orderId,
        userId,
        amount,
        currency,
        paymentMethod,
        paymentDetails: {
          ...paymentDetails,
          // Kart numarasının sadece son 4 hanesini saklıyoruz
          cardNumber: paymentDetails?.cardNumber?.slice(-4) || null
        },
        billingAddress,
        status: isSuccessful ? 'completed' : 'failed',
        errorMessage: isSuccessful ? null : 'Ödeme işlemi başarısız oldu'
      });

      await payment.save();

      ResponseHandler.success(res, { payment: payment.summary }, 201);
    } catch (error) {
      logger.error(`Ödeme oluşturma hatası: ${error.message}`);
      next(error);
    }
  }

  /**
   * Ödeme durumunu sorgulama
   * @route GET /api/payments/:id
   */
  static async getPaymentById(req, res, next) {
    try {
      const payment = await Payment.findById(req.params.id);
      
      if (!payment) {
        return ResponseHandler.error(res, 'Ödeme bulunamadı', 404);
      }
      
      ResponseHandler.success(res, { payment });
    } catch (error) {
      logger.error(`Ödeme sorgulama hatası: ${error.message}`);
      next(error);
    }
  }

  /**
   * Sipariş ID'sine göre ödemeleri getirme
   * @route GET /api/payments/order/:orderId
   */
  static async getPaymentsByOrderId(req, res, next) {
    try {
      const payments = await Payment.findByOrderId(req.params.orderId);
      
      ResponseHandler.success(res, { payments });
    } catch (error) {
      logger.error(`Sipariş ödemeleri sorgulama hatası: ${error.message}`);
      next(error);
    }
  }

  /**
   * Kullanıcı ID'sine göre ödemeleri getirme
   * @route GET /api/payments/user/:userId
   */
  static async getPaymentsByUserId(req, res, next) {
    try {
      const payments = await Payment.findByUserId(req.params.userId);
      
      ResponseHandler.success(res, { 
        payments: payments.map(payment => payment.summary) 
      });
    } catch (error) {
      logger.error(`Kullanıcı ödemeleri sorgulama hatası: ${error.message}`);
      next(error);
    }
  }

  /**
   * Ödeme iptali
   * @route PUT /api/payments/:id/cancel
   */
  static async cancelPayment(req, res, next) {
    try {
      const payment = await Payment.findById(req.params.id);
      
      if (!payment) {
        return ResponseHandler.error(res, 'Ödeme bulunamadı', 404);
      }
      
      if (!payment.isPending()) {
        return ResponseHandler.error(res, 'Sadece bekleyen ödemeler iptal edilebilir', 400);
      }
      
      payment.status = 'cancelled';
      payment.refundReason = req.body.reason || 'Müşteri isteği ile iptal edildi';
      
      await payment.save();
      
      ResponseHandler.success(res, { payment: payment.summary });
    } catch (error) {
      logger.error(`Ödeme iptal hatası: ${error.message}`);
      next(error);
    }
  }

  /**
   * Ödeme iadesi
   * @route PUT /api/payments/:id/refund
   */
  static async refundPayment(req, res, next) {
    try {
      const payment = await Payment.findById(req.params.id);
      
      if (!payment) {
        return ResponseHandler.error(res, 'Ödeme bulunamadı', 404);
      }
      
      if (!payment.canBeRefunded()) {
        return ResponseHandler.error(res, 'Bu ödeme iade edilemez', 400);
      }
      
      payment.status = 'refunded';
      payment.refundReason = req.body.reason || 'Müşteri isteği ile iade edildi';
      
      await payment.save();
      
      ResponseHandler.success(res, { payment: payment.summary });
    } catch (error) {
      logger.error(`Ödeme iade hatası: ${error.message}`);
      next(error);
    }
  }
}

module.exports = PaymentController; 