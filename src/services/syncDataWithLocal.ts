import { RabbitMQPublisher } from "../message_brokers/rabbitmq.publisher";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { ProductRepository } from "../repositories/ProductRepository";
// First, let's define/update the DTOs clearly

export class CentralDataService {
  static async syncDataWithLocal() {
    // Fetch categories and products separately
    const categories = await CategoryRepository.getAllCategories();
    const products = await ProductRepository.getAllProducts();
    console.log(categories);
    console.log(products);
    // First broadcast all categories
    for (const category of categories) {
      await RabbitMQPublisher.broadcastMessage({
        action: "create",
        table: "category",
        data: { name: category.name },
      });
    }

    // Then broadcast all products with null check
    for (const product of products) {
      // Find the category name for this product with proper type checking
      const categoryName = categories.find((cat) => cat.products?.some((p) => p.id === product.id))?.name;

      await RabbitMQPublisher.broadcastMessage({
        action: "create",
        table: "product",
        data: {
          name: product.name,
          measure: product.measure,
          quantity: 500,
          price: product.price,
          category_name: categoryName || "uncategorized", // Provide a default value
        },
      });
    }

    console.log("Data broadcast to local servers completed.");
  }
}
