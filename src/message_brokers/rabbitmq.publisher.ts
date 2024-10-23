import { RabbitMQConnection } from "./rabbitmq.connection";
import { RABBITMQ_CONFIG } from "../config/rabbitmq.config";
import { UnsentMessageRepository } from "../repositories/UnsentMessageRepository";

export class RabbitMQPublisher {
  static async broadcastMessage(message: any): Promise<void> {
    try {
      const channel = await RabbitMQConnection.getChannel();
      if (!channel) {
        throw new Error("RabbitMQ channel not available");
      }
      await channel.assertExchange(RABBITMQ_CONFIG.exchange.broadcast, "fanout", { durable: true });

      channel.publish(RABBITMQ_CONFIG.exchange.broadcast, "", Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
      console.log("Broadcast message sent.");
    } catch (error) {
      console.error("Error broadcasting message, saving locally", error);
      await UnsentMessageRepository.saveMessage(message, RABBITMQ_CONFIG.exchange.broadcast);
    }
  }

  static async resendUnsentMessages(): Promise<void> {
    const unsentMessages = await UnsentMessageRepository.getUnsentMessages();
    for (const unsentMessage of unsentMessages) {
      try {
        const channel = await RabbitMQConnection.getChannel();
        if (!channel) {
          console.log("RabbitMQ channel not available, will try resending later");
          break;
        }
        await channel.assertExchange(unsentMessage.queue, "fanout", { durable: true });

        channel.publish(unsentMessage.queue, "", Buffer.from(JSON.stringify(unsentMessage.message)), {
          persistent: true,
        });

        await UnsentMessageRepository.deleteMessage(unsentMessage.id);
        console.log(`Resent message ${unsentMessage.id}`);
      } catch (error) {
        console.error(`Error resending unsent message ${unsentMessage.id}`, error);
      }
    }
  }
}
