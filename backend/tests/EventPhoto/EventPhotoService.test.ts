// Mock todas las dependencias problemáticas ANTES de importar
jest.mock("../../src/EventPhoto/S3Service", () => ({
  S3Service: jest.fn().mockImplementation(() => ({
    uploadPhoto: jest.fn().mockResolvedValue("https://s3.amazonaws.com/bucket/photos/test.jpg"),
    deletePhoto: jest.fn().mockResolvedValue(undefined),
  }))
}));

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("mock-uuid-123")
}));

jest.mock("aws-sdk", () => ({
  S3: jest.fn().mockImplementation(() => ({}))
}));

import { EventPhotoService } from "../../src/EventPhoto/EventPhotoService";

describe("EventPhotoService", () => {
  let eventPhotoService: EventPhotoService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      getByEventId: jest.fn(),
      getByUserId: jest.fn(),
      countByUserAndEvent: jest.fn(),
      deleteById: jest.fn(),
      getById: jest.fn(),
    };

    // Pasar el mockRepository al constructor, el S3Service se mockea automáticamente
    eventPhotoService = new EventPhotoService(mockRepository);
  });

  it("should upload photo successfully when under limit", async () => {
    const eventId = "123e4567-e89b-12d3-a456-426614174000";
    const userId = "123e4567-e89b-12d3-a456-426614174001";
    const file = Buffer.from("fake image data");
    const originalName = "test.jpg";

    mockRepository.countByUserAndEvent.mockResolvedValue(2); // Bajo el límite de 5

    await eventPhotoService.uploadPhoto(eventId, userId, file, originalName, "Test caption");

    expect(mockRepository.countByUserAndEvent).toHaveBeenCalledWith(userId, eventId);
    expect(mockRepository.create).toHaveBeenCalled();
  });

  it("should get photos for event", async () => {
    const eventId = "123e4567-e89b-12d3-a456-426614174000";
    const mockPhotos = [
      { id: "photo1", eventId, userId: "user1", imageUrl: "url1" },
      { id: "photo2", eventId, userId: "user2", imageUrl: "url2" }
    ];

    mockRepository.getByEventId.mockResolvedValue(mockPhotos);

    const result = await eventPhotoService.getPhotosForEvent(eventId);

    expect(mockRepository.getByEventId).toHaveBeenCalledWith(eventId);
    expect(result).toEqual(mockPhotos);
  });

  it("should delete photo successfully when user owns it", async () => {
    const photoId = "123e4567-e89b-12d3-a456-426614174000";
    const userId = "123e4567-e89b-12d3-a456-426614174001";
    const mockPhoto = {
      id: photoId,
      userId: userId,
      imageUrl: "https://s3.amazonaws.com/bucket/photos/test.jpg"
    };

    mockRepository.getById.mockResolvedValue(mockPhoto);

    await eventPhotoService.deletePhoto(photoId, userId);

    expect(mockRepository.getById).toHaveBeenCalledWith(photoId);
    expect(mockRepository.deleteById).toHaveBeenCalledWith(photoId);
  });

  it("should get user photo count", async () => {
    const userId = "123e4567-e89b-12d3-a456-426614174000";
    const eventId = "123e4567-e89b-12d3-a456-426614174001";

    mockRepository.countByUserAndEvent.mockResolvedValue(3);

    const result = await eventPhotoService.getUserPhotoCount(userId, eventId);

    expect(mockRepository.countByUserAndEvent).toHaveBeenCalledWith(userId, eventId);
    expect(result).toBe(3);
  });
});