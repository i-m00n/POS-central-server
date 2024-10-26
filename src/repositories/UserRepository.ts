import { User } from "../entities/userEntity";
import { AppDataSource } from "../config/database.config";
import { NotFoundError } from "../utils/CustomError";

export const UserRepository = AppDataSource.getRepository(User).extend({
  async findByUsername(username: string): Promise<User> {
    const user = await this.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  },
});
