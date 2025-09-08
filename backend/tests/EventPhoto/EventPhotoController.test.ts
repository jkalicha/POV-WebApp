import { EventPhotoController } from "../../src/EventPhoto/EventPhotoController";
import { IEventPhotoService } from "../../src/EventPhotoInterfaces/IEventPhotoService";

describe("EventPhotoController", () => {
  let eventPhotoController: EventPhotoController;
  let mockEventPhotoService: jest.Mocked<IEventPhotoService>;

  beforeEach(() => {
    mockEventPhotoService = {
      uploadPhoto: jest.fn(),
      getPhotosForEvent: jest.fn(),
      deletePhoto: jest.fn(),
      getUserPhotoCount: jest.fn(),
    } as jest.Mocked<IEventPhotoService>;

    eventPhotoController = new EventPhotoController(mockEventPhotoService);
  });

  it("should upload photo successfully", async () => {
    const eventId = "123e4567-e89b-12d3-a456-426614174000";
    const userId = "123e4567-e89b-12d3-a456-426614174001";
    const file = Buffer.from("fake image data");
    const originalName = "test.jpg";
    const caption = "Test caption";

    mockEventPhotoService.uploadPhoto.mockResolvedValue(undefined);

    await eventPhotoController.uploadPhoto(eventId, userId, file, originalName, caption);

    expect(mockEventPhotoService.uploadPhoto).toHaveBeenCalledWith(eventId, userId, file, originalName, caption);
  });

  it("should get event photos successfully", async () => {
    const eventId = "123e4567-e89b-12d3-a456-426614174000";
    const mockPhotos = [{ id: "photo1", eventId, userId: "user1", imageUrl: "url1" }];

    mockEventPhotoService.getPhotosForEvent.mockResolvedValue(mockPhotos);

    const result = await eventPhotoController.getEventPhotos(eventId);

    expect(mockEventPhotoService.getPhotosForEvent).toHaveBeenCalledWith(eventId);
    expect(result).toEqual(mockPhotos);
  });

  it("should delete photo successfully", async () => {
    const photoId = "123e4567-e89b-12d3-a456-426614174000";
    const userId = "123e4567-e89b-12d3-a456-426614174001";

    mockEventPhotoService.deletePhoto.mockResolvedValue(undefined);

    await eventPhotoController.deletePhoto(photoId, userId);

    expect(mockEventPhotoService.deletePhoto).toHaveBeenCalledWith(photoId, userId);
  });

  it("should get user photo count successfully", async () => {
    const userId = "123e4567-e89b-12d3-a456-426614174000";
    const eventId = "123e4567-e89b-12d3-a456-426614174001";

    mockEventPhotoService.getUserPhotoCount.mockResolvedValue(3);

    const result = await eventPhotoController.getUserPhotoCount(userId, eventId);

    expect(mockEventPhotoService.getUserPhotoCount).toHaveBeenCalledWith(userId, eventId);
    expect(result).toBe(3);
  });
});
