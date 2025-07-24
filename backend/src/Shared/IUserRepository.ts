import { IRepository } from "./IRepository";
import { User } from "../User/User";

export interface IUserRepository extends IRepository<User> {
  getByEmail(email: string): Promise<User | null>;
}