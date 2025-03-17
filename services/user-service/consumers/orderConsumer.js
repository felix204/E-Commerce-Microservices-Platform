const amqp = require('amqplib');
const User = require('../models/userModel');
const logger = require('/app/common/utils/logger');

async function startOrderConsumer() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    await channel.assertExchange('order_events', 'topic', { durable: true });
    const q = await channel.assertQueue('user_order_queue', { durable: true });

    // Sipariş oluşturuldu olayını dinle
    await channel.bindQueue(q.queue, 'order_events', 'order.created');

    logger.info('Kullanıcı servisi sipariş olaylarını dinlemeye başladı');

    channel.consume(q.queue, async (msg) => {
      try {
        const orderData = JSON.parse(msg.content.toString());
        logger.info(`Sipariş oluşturuldu olayı alındı: ${orderData.orderId}`);

        // Kullanıcının sipariş geçmişini güncelle
        const user = await User.findById(orderData.userId);

        if (user) {
          if (!user.orderHistory) {
            user.orderHistory = [];
          }

          user.orderHistory.push({
            orderId: orderData.orderId,
            productId: orderData.productId,
            totalPrice: orderData.totalPrice,
            date: new Date()
          });

          await user.save();
          logger.info(`Kullanıcı sipariş geçmişi güncellendi: ${user._id}`);
        }

        channel.ack(msg);
      } catch (error) {
        logger.error('Sipariş olayı işlenirken hata oluştu:', error);
        channel.nack(msg, false, true); // Mesajı tekrar kuyruğa ekle
      }
    });
  } catch (error) {
    logger.error('RabbitMQ bağlantısı kurulurken hata oluştu:', error);
    // Bağlantı hatası durumunda tekrar dene
    setTimeout(startOrderConsumer, 5000);
  }
}

module.exports = startOrderConsumer;