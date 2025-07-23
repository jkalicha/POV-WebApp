import { SALT_ROUNDS, UserService } from "./../../src/User/UserService";
import bcrypt from "bcryptjs";

jest.mock("./../../src/User/UserRepository");

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      getByEmail: jest.fn(),
      create: jest.fn(),
      loginUser: jest.fn(),
    };

    userService = new UserService(mockUserRepository);
  });

  describe("createUser", () => {
    it("should create a user with valid data", async () => {
      const name = "Joaquin Kalichman";
      const email = "joaquinkalichman@example.com";
      const password = "Password123";

      mockUserRepository.getByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(undefined);

      await userService.createUser(name, email, password);

      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith(email);
      expect(mockUserRepository.create).toHaveBeenCalled();
    });
    it("should throw an error if email already exists", async () => {
      const name = "Joaquin Kalichman";
      const email = "joaquinkalichman@example.com";
      const password = "Password123";

      mockUserRepository.getByEmail.mockResolvedValue({ id: 1, email });

      await expect(userService.createUser(name, email, password)).rejects.toThrow("Email already exists");

      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith(email);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
    it("should throw an error for invalid name", async () => {
      const name = "Joaquin123";
      const email = "joaquinkalichman@example.com";
      const password = "Password123";

      await expect(userService.createUser(name, email, password)).rejects.toThrow("Invalid name");

      expect(mockUserRepository.getByEmail).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });
  describe("loginUser", () => {
    it("should return a token for valid credentials", async () => {
      const email = "joaquinkalichman@example.com";
      const password = "Password123";
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const mockUser = {
        id: "1",
        email,
        password: hashedPassword,
      };

      mockUserRepository.getByEmail.mockResolvedValue(mockUser);

      const token = await userService.loginUser(email, password);

      expect(token).toBeDefined();
      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith(email);
    });
    it("should throw an error for invalid email (user not found)", async () => {
      const email = "nonexistent@example.com";
      const password = "Password123";

      mockUserRepository.getByEmail.mockResolvedValue(null);

      await expect(userService.loginUser(email, password)).rejects.toThrow("Invalid email or password");
      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith(email);
    });
    it("should throw an error for invalid email format (schema validation)", async () => {
      const invalidEmail = "invalid-email-format";
      const password = "Password123";

      await expect(userService.loginUser(invalidEmail, password)).rejects.toThrow("Invalid email format");
      expect(mockUserRepository.getByEmail).not.toHaveBeenCalled();
    });
    it("should throw an error for empty password (schema validation)", async () => {
      const email = "joaquinkalichman@example.com";
      const emptyPassword = "";

      await expect(userService.loginUser(email, emptyPassword)).rejects.toThrow();
      expect(mockUserRepository.getByEmail).not.toHaveBeenCalled();
    });
  });
});
