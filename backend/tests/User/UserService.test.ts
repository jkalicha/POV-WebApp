import { UserService } from "./../../src/User/UserService";

jest.mock("./../../src/User/UserRepository");

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      getByEmail: jest.fn(),
      create: jest.fn(),
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
});
