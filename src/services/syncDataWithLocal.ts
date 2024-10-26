import { RabbitMQPublisher } from "../message_brokers/rabbitmq.publisher";
import { CategoryRepository } from "../repositories/CategoryRepository";

export class CentralDataService {
  static async syncDataWithLocal() {
    // Fetch categories
    const categories = await CategoryRepository.find({ relations: ["products"] });

    // Map categories for broadcast
    const categoriesData = categories.map((category) => ({
      name: category.name,
      products: category.products.map((product) => ({
        name: product.name,
        measure: product.measure,
        quantity: 500,
        price: product.price,
        category_name: category.name,
      })),
    }));

    // Send each category with products
    for (const categoryData of categoriesData) {
      // Send category data
      await RabbitMQPublisher.broadcastMessage({
        action: "create",
        table: "category",
        data: { name: categoryData.name },
      });

      // Send associated products
      for (const productData of categoryData.products) {
        await RabbitMQPublisher.broadcastMessage({
          action: "create",
          table: "product",
          data: productData,
        });
      }
    }

    console.log("Data broadcast to local servers completed.");
  }
}
