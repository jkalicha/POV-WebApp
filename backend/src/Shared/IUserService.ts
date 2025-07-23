export interface IUserService {
    createUser(name: string, email: string, password: string): Promise<void>;
    loginUser(email: string, password: string): Promise<string>;
}