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

        const user = new User(name, email, password);
        await this._userRepository.create(user);
    }
}