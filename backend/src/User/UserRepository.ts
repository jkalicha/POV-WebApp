import { User } from "./User";
import { AppDataSource } from "../Database/AppDataSource";
import { IUserRepository } from "../UserInterfaces/IUserRepository";

export class UserRepository implements IUserRepository {
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

    //specific methods out of CRUD
    public async getByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { email: email }
        });
    }
}