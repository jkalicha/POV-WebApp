import { User } from "./User";
import { IRepository } from "../Shared/IRepository";

export class UserRepository implements IRepository<User> {
    public async getAll(): Promise<User[]> {
        return []; // Placeholder for actual implementation
    }

    public async getById(id: string): Promise<User | null> {
        return null; // Placeholder for actual implementation
    }

    public async create(entity: User): Promise<void> {
        // Placeholder for actual implementation
    }

    public async update(entity: User): Promise<void> {
        // Placeholder for actual implementation
    }

    public async delete(id: string): Promise<void> {
        // Placeholder for actual implementation
    }
}