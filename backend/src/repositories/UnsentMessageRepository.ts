import { EntityManager } from "typeorm";
import { AppDataSource } from "../config/database.config";
import { UnsentMessage } from "../entities/UnsentMessageEntity";

export const UnsentMessageRepository = AppDataSource.getRepository(UnsentMessage).extend({
  async saveMessage(message: any, queue: string, transactionalEntityManager?: EntityManager): Promise<UnsentMessage> {
    const unsentMessage = this.create({ message, queue });

    // If a transactional entity manager is provided, use it to save the message
    if (transactionalEntityManager) {
      return transactionalEntityManager.save(UnsentMessage, unsentMessage);
    }

    // Otherwise, use the default repository save method
    return this.save(unsentMessage);
  },

  async getUnsentMessages(): Promise<UnsentMessage[]> {
    return this.find({ order: { createdAt: "ASC" } });
  },

  async deleteMessage(id: number): Promise<void> {
    const result = await this.delete(id);
    if (result.affected === 0) {
      throw new Error(`UnsentMessage with id ${id} not found.`);
    }
  },
});
