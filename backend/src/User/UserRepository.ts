import { User } from "./User";
import { IRepository } from "../Shared/IRepository";
import { AppDataSource } from "../Database/AppDataSource";

export class UserRepository implements IRepository<User> {
    private userRepository = AppDataSource.getRepository(User);

    public async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async getById(id: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { id: id }
        })
    }

    public async create(entity: User): Promise<void> {
        await this.userRepository.save(entity);
    }

    public async update(entity: User): Promise<void> {
        await this.userRepository.update(entity.id, entity);
    }

    public async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}