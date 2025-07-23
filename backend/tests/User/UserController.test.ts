import { UserController } from "../../src/User/UserController";
import { IUserService } from "../../src/Shared/IUserService";

describe("UserController", () => {
  let userController: UserController;
  let mockUserService: jest.Mocked<IUserService>;

  beforeEach(() => {
    mockUserService = {
      createUser: jest.fn(),
      loginUser: jest.fn(),
    };

    userController = new UserController(mockUserService);
  });

  describe("createUser", () => {
    it("should delegate to userService", async () => {
      const name = "Joaquin Kalichman";
      const email = "joaquinkalichman@example.com";
      const password = "Password123";

      mockUserService.createUser.mockResolvedValue(undefined);

      await userController.createUser(name, email, password);

      expect(mockUserService.createUser).toHaveBeenCalledWith(
        name,
        email,
        password
      );
      expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
    });
  });
  describe("loginUser", () => {
    it("should return a token when login is successful", async () => {
      const email = "joaquinkalichman@example.com";
      const password = "Password123";
      const expectedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-token";

      mockUserService.loginUser.mockResolvedValue(expectedToken);

      const result = await userController.loginUser(email, password);

      expect(result).toBe(expectedToken);
      expect(mockUserService.loginUser).toHaveBeenCalledWith(email, password);
      expect(mockUserService.loginUser).toHaveBeenCalledTimes(1);
    });
  });
});
