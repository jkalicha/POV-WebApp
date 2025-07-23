import { User } from "./User";
import { UserRepository } from "./UserRepository";
import { IUserService } from "../Shared/IUserService";
import crypto from "node:crypto";
import { z } from "zod";

const CreateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(20, "Name must be less than 20 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Invalid name"),
  email: z
    .email("Invalid email format")
    .trim()
    .min(1, "Email is required")
    .max(50, "Email must be less than 50 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(128, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
});

export class UserService implements IUserService {
  private _userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository;
  }

  async createUser(name: string, email: string, password: string): Promise<void> {
    const validatedData = CreateUserSchema.safeParse({name, email, password});
    if (!validatedData.success) {
      throw new Error(validatedData.error.issues.map((issue) => issue.message).join(", "));
    }
    const existingUser = await this._userRepository.getByEmail(validatedData.data.email);
    if (existingUser) {
        throw new Error('Email already exists');
    }
    const userId = crypto.randomUUID();
    const user = new User(
        validatedData.data.name, validatedData.data.email, validatedData.data.password, userId);
    await this._userRepository.create(user);
  }
}
