import { AppDataSource } from "../config/database.config";
import { CentralCustomer } from "../entities/CustomerEntity";
import { CreateCustomerDTO } from "../dtos/Customer/CreateCustomerDTO";
import { UpdateCustomerDataDTO } from "../dtos/Customer/UpdateCustomerDataDTO";
import { GetFilteredCustomersDTO } from "../dtos/Customer/GetFilteredCustomersDTO";
import { CustomerResponseDTO } from "../dtos/Customer/CustomerResponseDTO";
import { ConflictError, NotFoundError } from "../utils/CustomError";
import { EntityManager } from "typeorm";

export const CustomerRepository = AppDataSource.getRepository(CentralCustomer).extend({
  getRepo(transactionalEntityManager?: EntityManager) {
    return transactionalEntityManager ? transactionalEntityManager.getRepository(CentralCustomer) : this;
  },

  async updateCustomerData(
    dto: UpdateCustomerDataDTO,
    transactionalEntityManager?: EntityManager
  ): Promise<CustomerResponseDTO> {
    const repo = this.getRepo(transactionalEntityManager);

    const customer = await repo.findOneBy({ phone_number: dto.phone_number });

    if (!customer) {
      throw new NotFoundError("Customer not found");
    }

    if (dto.total_paid !== undefined) {
      customer.total_paid = Number(customer.total_paid) + Number(dto.total_paid);
    }
    if (dto.name !== undefined) {
      customer.name = dto.name;
    }
    if (dto.class !== undefined) {
      customer.class = dto.class;
    }

    const updatedCustomer = await repo.save(customer);

    const customerResponseDTO: CustomerResponseDTO = {
      name: updatedCustomer.name,
      phone_number: updatedCustomer.phone_number,
      total_paid: updatedCustomer.total_paid,
      class: updatedCustomer.class,
    };

    return customerResponseDTO;
  },

  async createCustomer(
    dto: CreateCustomerDTO,
    transactionalEntityManager?: EntityManager
  ): Promise<CustomerResponseDTO> {
    const repo = this.getRepo(transactionalEntityManager);

    // First check if customer with this phone number already exists
    const existingCustomer = await repo.findOne({
      where: { phone_number: dto.phone_number },
    });

    if (existingCustomer) {
      throw new ConflictError(`Customer with phone number ${dto.phone_number} already exists.`);
    }

    // If no existing customer found, create new one
    const customer = repo.create(dto);
    const savedCustomer = await repo.save(customer);

    const customerResponseDTO: CustomerResponseDTO = {
      name: savedCustomer.name,
      phone_number: savedCustomer.phone_number,
      total_paid: savedCustomer.total_paid,
      class: savedCustomer.class,
    };
    return customerResponseDTO;
  },
  async getAllCustomers(): Promise<CustomerResponseDTO[]> {
    const customers = await this.find({
      relations: ["orders"],
    });
    if (!customers || customers.length == 0) {
      throw new NotFoundError("No customers found.");
    }
    const customerResponseDTO: CustomerResponseDTO[] = customers.map((customer) => ({
      name: customer.name,
      phone_number: customer.phone_number,
      total_paid: customer.total_paid,
      class: customer.class,
    }));

    return customerResponseDTO;
  },
  async getFilteredCustomers(dto: GetFilteredCustomersDTO): Promise<CustomerResponseDTO[]> {
    const queryBuilder = CustomerRepository.createQueryBuilder("customer");
    if (dto.name) {
      queryBuilder.andWhere("customer.name LIKE :name", { name: `%${dto.name}%` });
    }
    if (dto.class) {
      queryBuilder.andWhere("customer.class=:class", { class: dto.class });
    }
    if (dto.phone_number) {
      queryBuilder.andWhere("customer.phone_number=:phone_number", { phone_number: dto.phone_number });
    }
    if (dto.total_paid) {
      queryBuilder.andWhere("customer.total_paid=:total_paid", { total_paid: dto.total_paid });
    }
    const customers = await queryBuilder.getMany();
    if (!customers || customers.length == 0) {
      throw new NotFoundError("No customer found with the provided filters");
    }
    const customerResponseDTO: CustomerResponseDTO[] = customers.map((customer) => ({
      phone_number: customer.phone_number,
      name: customer.name,
      total_paid: customer.total_paid,
      class: customer.class,
    }));

    return customerResponseDTO;
  },
  async deleteCustomerByName(name: string, transactionalEntityManager?: EntityManager): Promise<CustomerResponseDTO> {
    const repo = this.getRepo(transactionalEntityManager);

    const customer = await repo.findOneBy({ name });

    if (!customer) {
      throw new NotFoundError("Customer not found");
    }

    await repo.remove(customer);

    // Map to CustomerResponseDTO
    const customerResponseDTO: CustomerResponseDTO = {
      phone_number: customer.phone_number,
      name: customer.name,
      total_paid: customer.total_paid,
      class: customer.class,
    };

    return customerResponseDTO;
  },

  async deleteAllCustomers(transactionalEntityManager?: EntityManager): Promise<void> {
    const repo = this.getRepo(transactionalEntityManager);

    const customers = await repo.find();
    if (customers.length == 0) {
      throw new NotFoundError("no customers to delete");
    }
    await repo.remove(customers);
  },
});
