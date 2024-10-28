import { RabbitMQConnection } from "./rabbitmq.connection";
import { RABBITMQ_CONFIG } from "../config/rabbitmq.config";
import { CreateOrderDTO } from "../dtos/Order/CreateOrderDTO";
import { OrderRepository } from "../repositories/OrderRepository";
import { CreateOperationDTO } from "../dtos/Operation/CreateOperationDTO";
import { OperationRepository } from "../repositories/OperationRepository";
import { NotFoundError } from "../utils/CustomError";
import { CentralDataService } from "../services/syncDataWithLocal";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { UpdateCustomerDataDTO } from "../dtos/Customer/UpdateCustomerDataDTO";
import { ProductRepository } from "../repositories/ProductRepository";
export class RabbitMQConsumer {
  static async listenToLocalServers() {
    try {
      const channel = await RabbitMQConnection.getChannel();

      if (!channel) {
        console.log("Cannot handle messages, no channel available.");
        return;
      }

      await channel.assertExchange(RABBITMQ_CONFIG.exchange.localToCentral, "direct", { durable: true });
      const queue = await channel.assertQueue(RABBITMQ_CONFIG.queues.centralQueue, { durable: true });
      await channel.bindQueue(queue.queue, RABBITMQ_CONFIG.exchange.localToCentral, "");

      channel.consume(
        RABBITMQ_CONFIG.queues.centralQueue,
        async (message) => {
          if (message) {
            const { action, table, data, branch_name } = JSON.parse(message.content.toString());

            if (table === "order&operations" && action === "create") {
              try {
                const { total_price, order_type, order_method, date, customer_phone_number, operations } = data;

                const createOrderDTO: CreateOrderDTO = {
                  total_price,
                  branch_name,
                  order_type,
                  order_method,
                  date,
                  customer_phone_number,
                };

                // Create the order
                const orderResponse = await OrderRepository.createOrder(createOrderDTO);
                if (!orderResponse.id) {
                  throw new Error("Order ID not found.");
                }

                // Create the operations linked to this order
                for (const operationData of operations) {
                  const createOperationDTO: CreateOperationDTO = {
                    quantity: operationData.quantity,
                    total_price: operationData.total_price,
                    order_id: orderResponse.id,
                    product_name: operationData.name,
                  };

                  await OperationRepository.createOperation(createOperationDTO);
                }

                // Update customer's total paid amount
                const updatedCustomerTotal = total_price; // Adjust this based on how you want to calculate total paid

                const updateCustomerDataDTO: UpdateCustomerDataDTO = {
                  phone_number: customer_phone_number,
                  total_paid: updatedCustomerTotal,
                };

                await CustomerRepository.updateCustomerData(updateCustomerDataDTO);

                console.log("Order, operations, and customer total paid updated successfully.");
              } catch (error) {
                console.error("Error processing message:", error);
              } finally {
                channel.ack(message);
              }
            } else if (table == "category" && action == "sync") {
              try {
                await CentralDataService.syncDataWithLocal();
              } catch (error) {
                console.error("Error processing message:", error);
              } finally {
                channel.ack(message);
              }
            } else {
              console.log("Received unhandled message:", table, action);
              channel.ack(message);
            }
          }
        },
        { noAck: false }
      );
      console.log("Listening to Local Server messages...");
    } catch (error) {
      console.error("Error setting up RabbitMQ consumer, will retry", error);
      setTimeout(() => this.listenToLocalServers(), 5000);
    }
  }

  // Subscribe to reconnection events and re-initiate the listener
  static initReconnectionListener() {
    RabbitMQConnection.onReconnected(() => {
      console.log("Reconnected to RabbitMQ, restarting consumer...");
      this.listenToLocalServers().catch((error) => {
        console.error("Failed to restart RabbitMQ Consumer after reconnection", error);
      });
    });
  }
}
