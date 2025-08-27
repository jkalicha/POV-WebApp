import { IUserService } from "../UserInterfaces/IUserService";

export class UserController {
    private userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }

    public async createUser(name: string, email: string, password: string): Promise<void> {
        await this.userService.createUser(name, email, password);
    }

    public async loginUser(email: string, password: string): Promise<string> {
        return await this.userService.loginUser(email, password);
    }
}