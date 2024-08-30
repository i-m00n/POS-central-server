import { RabbitMQConnection } from "./rabbitmq.connection";
import { RABBITMQ_CONFIG } from "../config/rabbitmq.config";

export class RabbitMQPublisher {
  static async broadcastMessage(message: string) {
    const channel = await RabbitMQConnection.getChannel();
    await channel.assertExchange(RABBITMQ_CONFIG.exchange.broadcast, "fanout", { durable: true });
    channel.publish(RABBITMQ_CONFIG.exchange.broadcast, "", Buffer.from(message), { persistent: true });
  }
}
