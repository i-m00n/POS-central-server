import amqp from "amqplib";
import { RABBITMQ_CONFIG } from "../config/rabbitmq.config";
import EventEmitter from "events";
export class RabbitMQConnection {
  private static connection: amqp.Connection | null = null;
  private static channel: amqp.Channel | null = null;
  private static isConnecting: boolean = false;
  private static reconnectInterval: NodeJS.Timeout | null = null;
  private static firstConnection: boolean = true;

  private static connectionRestoredEventEmitter = new EventEmitter();

  static async getConnection(): Promise<amqp.Connection | null> {
    if (!this.connection && !this.isConnecting) {
      this.isConnecting = true;
      try {
        this.connection = await amqp.connect(RABBITMQ_CONFIG.host);
        console.log("RabbitMQ connected.");
        this.connection.on("error", this.handleConnectionError.bind(this));
        this.connection.on("close", this.handleConnectionClose.bind(this));
        if (this.reconnectInterval) {
          clearInterval(this.reconnectInterval);
          this.reconnectInterval = null;
        }

        // Emit event that connection is restored if it's not the initial connection
        if (!this.firstConnection) this.connectionRestoredEventEmitter.emit("reconnected");
        this.firstConnection = false;
      } catch (error) {
        console.error("RabbitMQ connection failed, retrying...", error);
        this.scheduleReconnect();
      } finally {
        this.isConnecting = false;
      }
    }
    return this.connection;
  }

  static async getChannel(): Promise<amqp.Channel | null> {
    if (!this.channel) {
      const connection = await this.getConnection();
      if (!connection) {
        console.log("No RabbitMQ connection available, channel cannot be created");
        return null;
      }
      try {
        this.channel = await connection.createChannel();
        this.channel.on("error", this.handleChannelError.bind(this));
        this.channel.on("close", this.handleChannelClose.bind(this));
      } catch (error) {
        console.error("Failed to create RabbitMQ channel", error);
        return null;
      }
    }
    return this.channel;
  }

  private static handleConnectionError(error: any) {
    console.error("RabbitMQ connection error", error);
    this.connection = null;
    this.channel = null;
    this.scheduleReconnect();
  }

  private static handleConnectionClose() {
    console.log("RabbitMQ connection closed, attempting to reconnect...");
    this.connection = null;
    this.channel = null;
    this.scheduleReconnect();
  }

  private static handleChannelError(error: any) {
    console.error("RabbitMQ channel error", error);
    this.channel = null;
  }

  private static handleChannelClose() {
    console.log("RabbitMQ channel closed");
    this.channel = null;
  }

  private static scheduleReconnect() {
    if (!this.reconnectInterval) {
      this.reconnectInterval = setInterval(() => {
        console.log("Attempting to reconnect to RabbitMQ...");
        this.getConnection();
      }, 5000);
    }
  }

  static onReconnected(listen: () => void) {
    this.connectionRestoredEventEmitter.on("reconnected", listen);
  }
}
