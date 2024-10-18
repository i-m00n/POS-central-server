import { RabbitMQConnection } from "./rabbitmq.connection";
import { RABBITMQ_CONFIG } from "../config/rabbitmq.config";
import { CreateOrderDTO } from "../dtos/Order/CreateOrderDTO";
import { OrderRepository } from "../repositories/OrderRepository";
import { CreateOperationDTO } from "../dtos/Operation/CreateOperationDTO";
import { OperationRepository } from "../repositories/OperationRepository";
import { NotFoundError } from "../utils/CustomError";
export class RabbitMQConsumer {
  static async handleMessageFromLocal() {
    const channel = await RabbitMQConnection.getChannel();

    await channel.assertExchange(RABBITMQ_CONFIG.exchange.localToCentral, "direct", { durable: true });

    const queue = await channel.assertQueue(RABBITMQ_CONFIG.queues.centralQueue, { durable: true });
    await channel.bindQueue(queue.queue, RABBITMQ_CONFIG.exchange.localToCentral, "");

    channel.consume(
      RABBITMQ_CONFIG.queues.centralQueue,
      async (message) => {
        if (message) {
          const { action, table, data, branch_name } = JSON.parse(message.content.toString());

          if (table === "order&operations" && action === "create") {
            const { total_price, order_type, order_method, date, customer_phone_number, operations } = data;

            const createOrderDTO: CreateOrderDTO = {
              total_price,
              branch_name,
              order_type,
              order_method,
              date,
              customer_phone_number,
            };

            try {
              const orderResponse = await OrderRepository.createOrder(createOrderDTO);
              if (!orderResponse.id) {
                throw new NotFoundError("order id not found");
              }

              // Now create operations linked to this order
              for (const operationData of operations) {
                const createOperationDTO: CreateOperationDTO = {
                  quantity: operationData.quantity,
                  total_price: operationData.total_price,
                  order_id: orderResponse.id,
                  product_id: operationData.product_id,
                };

                // Create each operation
                await OperationRepository.createOperation(createOperationDTO);
              }

              // console.log("Order and operations created successfully:", orderResponse);
            } catch (error) {
              console.error("Error creating order or operations:", error);
            } finally {
              channel.ack(message);
            }
          } else {
            console.log("Received message with unexpected table or action:", table, action);
            channel.ack(message);
          }
        }
      },
      { noAck: false }
    );
  }
}
