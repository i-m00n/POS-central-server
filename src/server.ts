import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./config/database.config";
import { RabbitMQConsumer } from "./message_brokers/rabbitmq.consumer"; // Import your consumer

const app = express();
const port = 3000;

app.use(bodyParser.json());

// ### Error handling middleware should be added here, after routes ###

// Initialize the database connection
AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");

    // Start listening to RabbitMQ broadcasts
    try {
      await RabbitMQConsumer.handleMessageFromLocal();
      console.log("Listening to RabbitMQ broadcasts...");
    } catch (error) {
      console.error("Failed to start RabbitMQ Consumer", error);
    }

    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
