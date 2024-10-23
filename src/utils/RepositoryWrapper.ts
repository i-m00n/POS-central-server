import { Repository, EntityManager, ObjectLiteral } from "typeorm";
import { AppDataSource } from "../config/database.config";

export class RepositoryWrapper<Entity extends ObjectLiteral> {
  private repository: Repository<Entity>;
  constructor(private entity: new () => Entity) {
    this.repository = AppDataSource.getRepository(this.entity);
  }
  getRepository(entityManager?: EntityManager): Repository<Entity> {
    return entityManager ? entityManager.getRepository(this.entity) : this.repository;
  }
}
