const Order = require('../models/orderModel');
const ResponseHandler = require('/app/common/utils/responsHandler');
const amqp = require('amqplib');

// RabbitMQ bağlantısı için yardımcı fonksiyon
async function connectToRabbitMQ() {
  const connection = await amqp.connect('amqp://rabbitmq');
  const channel = await connection.createChannel();
  await channel.assertExchange('order_events', 'topic', { durable: true });
  return { connection, channel };
}

// Sipariş oluşturma
exports.createOrder = async (req, res) => {
  try {
    const { userId, productId, quantity, totalPrice } = req.body;

    // Sipariş oluştur
    const order = new Order({
      userId,
      productId,
      quantity,
      totalPrice,
      status: 'pending'
    });

    await order.save();

    // RabbitMQ'ya sipariş oluşturuldu olayını gönder
    const { channel } = await connectToRabbitMQ();

    channel.publish(
      'order_events',
      'order.created',
      Buffer.from(JSON.stringify({
        orderId: order._id,
        userId,
        productId,
        quantity,
        totalPrice
      }))
    );

    return ResponseHandler.success(res, 'Sipariş başarıyla oluşturuldu', order, 201);
  } catch (error) {
    return ResponseHandler.error(res, 'Sipariş oluşturulurken hata oluştu', error, 500);
  }
};

// Sipariş durumu güncelleme
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return ResponseHandler.error(res, 'Sipariş bulunamadı', null, 404);
    }

    // RabbitMQ'ya sipariş durumu güncellendi olayını gönder
    const { channel } = await connectToRabbitMQ();

    channel.publish(
      'order_events',
      'order.status_updated',
      Buffer.from(JSON.stringify({
        orderId: order._id,
        status: order.status
      }))
    );

    return ResponseHandler.success(res, 'Sipariş durumu güncellendi', order);
  } catch (error) {
    return ResponseHandler.error(res, 'Sipariş durumu güncellenirken hata oluştu', error, 500);
  }
};

// Tüm siparişleri getir
exports.getAllOrders = async (req, res) => {
  try {
    const filters = {};

    // Filtreler eklenebilir (örn. kullanıcıya göre, duruma göre)
    if (req.query.userId) {
      filters.userId = req.query.userId;
    }

    if (req.query.status) {
      filters.status = req.query.status;
    }

    const orders = await Order.find(filters).sort({ createdAt: -1 });

    return ResponseHandler.success(res, 'Siparişler başarıyla getirildi', orders);
  } catch (error) {
    return ResponseHandler.error(res, 'Siparişler getirilirken hata oluştu', error, 500);
  }
};

// Sipariş detayını getir
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return ResponseHandler.error(res, 'Sipariş bulunamadı', null, 404);
    }

    return ResponseHandler.success(res, 'Sipariş başarıyla getirildi', order);
  } catch (error) {
    return ResponseHandler.error(res, 'Sipariş getirilirken hata oluştu', error, 500);
  }
};

// Sipariş sil
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return ResponseHandler.error(res, 'Sipariş bulunamadı', null, 404);
    }

    // Siparişi sil
    await Order.findByIdAndDelete(orderId);

    // RabbitMQ'ya sipariş silindi olayını gönder
    const { channel } = await connectToRabbitMQ();

    channel.publish(
      'order_events',
      'order.deleted',
      Buffer.from(JSON.stringify({
        orderId: order._id,
        userId: order.userId,
        productId: order.productId
      }))
    );

    return ResponseHandler.success(res, 'Sipariş başarıyla silindi', { orderId });
  } catch (error) {
    return ResponseHandler.error(res, 'Sipariş silinirken hata oluştu', error, 500);
  }
};

// Kullanıcının siparişlerini getir
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return ResponseHandler.success(res, 'Kullanıcı siparişleri başarıyla getirildi', orders);
  } catch (error) {
    return ResponseHandler.error(res, 'Kullanıcı siparişleri getirilirken hata oluştu', error, 500);
  }
};



