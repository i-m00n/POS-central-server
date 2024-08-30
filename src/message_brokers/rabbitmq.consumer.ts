import { RabbitMQConnection } from "./rabbitmq.connection";
import { RABBITMQ_CONFIG } from "../config/rabbitmq.config";

export class RabbitMQConsumer {
  static async handleMessageFromLocal() {
    const channel = await RabbitMQConnection.getChannel();
    await channel.assertExchange(RABBITMQ_CONFIG.exchange.localToCentral, "direct", { durable: true });
    await channel.assertQueue(RABBITMQ_CONFIG.queues.centralQueue, { durable: true });
    await channel.bindQueue(RABBITMQ_CONFIG.queues.centralQueue, RABBITMQ_CONFIG.exchange.localToCentral, "");

    channel.consume(RABBITMQ_CONFIG.queues.centralQueue, (msg) => {
      if (msg !== null) {
        console.log("Message from local:", msg.content.toString());
        channel.ack(msg);
      }
    });
  }
}
