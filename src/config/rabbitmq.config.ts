export const RABBITMQ_CONFIG = {
  host: "amqp://localhost",
  exchange: {
    broadcast: "broadcast",
    localToCentral: "local_to_central",
  },
  queues: {
    centralQueue: "central_queue",
  },
};
