import { User } from "./User";
import { UserRepository } from "./UserRepository";
import { IUserService } from "../Shared/IUserService";

export class UserService implements IUserService {
    private _userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this._userRepository = userRepository;
    }

    async createUser(name: string, email: string, password: string): Promise<void> {
        if (!name || !email || !password) {
            throw new Error('Name, email and password are required');
        }
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }
        if (!this.isValidPassword(password)) {
            throw new Error('Password should contain at least 6 characters');
        }
        if (await this.isExistingUser(email)) {
            throw new Error('Email already exists');
        }
        const user = new User(name, email, password);
        await this._userRepository.create(user);
    }

    private isExistingUser(email: string): Promise<User | null> {
        return this._userRepository.getByEmail(email);
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPassword(password: string): boolean {
        return password.length >= 6;
    }
}