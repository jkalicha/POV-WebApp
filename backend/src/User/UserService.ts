import { User } from "./User";
import { UserRepository } from "./UserRepository";
import { IUserService } from "../Shared/IUserService";
import crypto from "node:crypto";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt, { SignOptions }from "jsonwebtoken";

export const SALT_ROUNDS = 10;
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
const LoginUserSchema = z.object({
  email: z
    .string()
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
    const hashedPassword = await bcrypt.hash(validatedData.data.password, SALT_ROUNDS);
    const user = new User(
        validatedData.data.name, validatedData.data.email, hashedPassword, userId);
    await this._userRepository.create(user);
  }

  async loginUser(email: string, password: string): Promise<string> {
    const validatedData = LoginUserSchema.safeParse({email, password});
    if (!validatedData.success) {
      throw new Error(validatedData.error.issues.map((issue) => issue.message).join(", "));
    }
    const user = await this._userRepository.getByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || "default_secret";
    const expiresIn = (process.env.JWT_EXPIRES_IN || "24h") as SignOptions['expiresIn'];
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn }
    );
    return token;
  }
}
