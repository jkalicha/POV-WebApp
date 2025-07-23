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
});
