import amqp from "amqplib";
import { RABBITMQ_CONFIG } from "../config/rabbitmq.config";

export class RabbitMQConnection {
  private static connection: amqp.Connection;
  private static channel: amqp.Channel;

  static async getConnection() {
    if (!this.connection) {
      this.connection = await amqp.connect(RABBITMQ_CONFIG.host);
    }
    return this.connection;
  }

  static async getChannel() {
    if (!this.channel) {
      const connection = await this.getConnection();
      this.channel = await connection.createChannel();
    }
    return this.channel;
  }
}
