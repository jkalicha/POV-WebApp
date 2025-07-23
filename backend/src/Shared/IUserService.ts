export interface IUserService {
    createUser(name: string, email: string, password: string): Promise<void>;
}