const amqp = require('amqplib');
const Product = require('../models/productModel');
const logger = require('/app/common/utils/logger');

async function startOrderConsumer() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    await channel.assertExchange('order_events', 'topic', { durable: true });
    const q = await channel.assertQueue('product_order_queue', { durable: true });

    // Sipariş oluşturuldu olayını dinle
    await channel.bindQueue(q.queue, 'order_events', 'order.created');

    logger.info('Ürün servisi sipariş olaylarını dinlemeye başladı');

    channel.consume(q.queue, async (msg) => {
      try {
        const orderData = JSON.parse(msg.content.toString());
        logger.info(`Sipariş oluşturuldu olayı alındı: ${orderData.orderId}`);

        // Ürün stok miktarını güncelle
        const product = await Product.findById(orderData.productId);

        if (product) {
          product.stock -= orderData.quantity;
          await product.save();
          logger.info(`Ürün stok miktarı güncellendi: ${product._id}`);
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
