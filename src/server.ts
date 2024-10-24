import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./config/database.config";
import OrderRoutes from "./routes/OrderRoutes";
import CategoryRoutes from "./routes/CategoryRoutes";
import OperationsRoutes from "./routes/OperationRoutes";
import ConfigRoutes from "./routes/ConfigRoutes";
import ProductRoutes from "./routes/ProductRoute";
import CustomerRoutes from "./routes/CustomerRoute";
import { errorHandler } from "./middlewares/ErrorHandler";
import { RabbitMQConsumer } from "./message_brokers/rabbitmq.consumer";
import cors from "cors";
import { RabbitMQPublisher } from "./message_brokers/rabbitmq.publisher";
import { error } from "console";

const app = express();
const port = 4000;
app.use(bodyParser.json());
app.use(cors());

app.use("/api", ProductRoutes);
app.use("/api", CustomerRoutes);
app.use("/api", OrderRoutes);
app.use("/api", CategoryRoutes);
app.use("/api", OperationsRoutes);
app.use("/api", ConfigRoutes);

// Error handling middleware should be added here, after routes ###
app.use(errorHandler);

// Initialize the database connection
AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");

    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

    // Start listening to RabbitMQ broadcasts
    RabbitMQConsumer.listenToLocalServers().catch((error) => {
      console.error("Failed to start RabbitMQ Consumer", error);
    });

    // Initialize reconnection listener
    RabbitMQConsumer.initReconnectionListener();

    // Set up periodic resend of unsent messages
    setInterval(() => {
      RabbitMQPublisher.resendUnsentMessages().catch((error) => {
        console.error("Error resending unsent messages", error);
      });
    }, 5000); // Try to resend every minute
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
