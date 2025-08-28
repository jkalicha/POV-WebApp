import { EventService } from "../../src/Event/EventService";
import { IEventRepository } from "../../src/EventInterfaces/IEventRepository";
import { IEventInvitationRepository } from "../../src/EventInterfaces/IEventInvitationRepository";

describe("EventService", () => {
  let eventService: EventService;
  let mockEventRepository: jest.Mocked<IEventRepository>;
  let mockEventInvitationRepository: jest.Mocked<IEventInvitationRepository>;

  beforeEach(() => {
    mockEventRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      getByTitle: jest.fn(),
      getByUserId: jest.fn(),
      getByIds: jest.fn(),
    };

      mockEventInvitationRepository = {
        getEventIdsByUserId: jest.fn(),
      } as jest.Mocked<IEventInvitationRepository>;

    eventService = new EventService(mockEventRepository, mockEventInvitationRepository);
  });

  describe("getEventsForUser", () => {
    it("should return both owner and invited events", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000";
      const ownerEvent = { id: "1" } as any;
      const invitedEvent = { id: "2" } as any;
      mockEventRepository.getByUserId.mockResolvedValue([ownerEvent]);
      mockEventInvitationRepository.getEventIdsByUserId.mockResolvedValue(["2"]);
      mockEventRepository.getByIds.mockResolvedValue([invitedEvent]);

      const result = await eventService.getEventsForUser(userId);
      expect(mockEventRepository.getByUserId).toHaveBeenCalledWith(userId);
      expect(mockEventInvitationRepository.getEventIdsByUserId).toHaveBeenCalledWith(userId);
      expect(mockEventRepository.getByIds).toHaveBeenCalledWith(["2"]);
      expect(result).toEqual({ owner: [ownerEvent], invited: [invitedEvent] });
    });

    it("should return only owner events if no invitations", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000";
      const ownerEvent = { id: "1" } as any;
      mockEventRepository.getByUserId.mockResolvedValue([ownerEvent]);
      mockEventInvitationRepository.getEventIdsByUserId.mockResolvedValue([]);
      mockEventRepository.getByIds.mockResolvedValue([]);

      const result = await eventService.getEventsForUser(userId);
      expect(result).toEqual({ owner: [ownerEvent], invited: [] });
    });

    it("should return only invited events if not owner of any", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000";
      const invitedEvent = { id: "2" } as any;
      mockEventRepository.getByUserId.mockResolvedValue([]);
      mockEventInvitationRepository.getEventIdsByUserId.mockResolvedValue(["2"]);
      mockEventRepository.getByIds.mockResolvedValue([invitedEvent]);

      const result = await eventService.getEventsForUser(userId);
      expect(result).toEqual({ owner: [], invited: [invitedEvent] });
    });

    it("should return empty arrays if no events", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000";
      mockEventRepository.getByUserId.mockResolvedValue([]);
      mockEventInvitationRepository.getEventIdsByUserId.mockResolvedValue([]);
      mockEventRepository.getByIds.mockResolvedValue([]);

      const result = await eventService.getEventsForUser(userId);
      expect(result).toEqual({ owner: [], invited: [] });
    });
  });

  describe("createEvent", () => {
    it("should create an event with valid data", async () => {
      const title = "Birthday Party";
      const date = "2025-12-25T20:00:00.000Z";
      const location = "My House";
      const ownerId = "123e4567-e89b-12d3-a456-426614174000";

      mockEventRepository.getByTitle.mockResolvedValue(null);
      mockEventRepository.create.mockResolvedValue(undefined);

      await eventService.createEvent(title, date, location, ownerId);

      expect(mockEventRepository.getByTitle).toHaveBeenCalledWith(title);
      expect(mockEventRepository.create).toHaveBeenCalled();
    });

    it("should throw an error if event title already exists", async () => {
      const title = "Birthday Party";
      const date = "2025-12-25T20:00:00.000Z";
      const location = "My House";
      const ownerId = "123e4567-e89b-12d3-a456-426614174000";

      const mockEvent = { id: "1", title, date, location, ownerId };
      mockEventRepository.getByTitle.mockResolvedValue(mockEvent as any);

      await expect(eventService.createEvent(title, date, location, ownerId)).rejects.toThrow(
        `Event with title "${title}" already exists.`
      );

      expect(mockEventRepository.getByTitle).toHaveBeenCalledWith(title);
      expect(mockEventRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error for invalid title", async () => {
      const title = "A"; // Too short (min 2 characters)
      const date = "2025-12-25T20:00:00.000Z";
      const location = "My House";
      const ownerId = "123e4567-e89b-12d3-a456-426614174000";

      await expect(eventService.createEvent(title, date, location, ownerId)).rejects.toThrow();

      expect(mockEventRepository.getByTitle).not.toHaveBeenCalled();
      expect(mockEventRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error for invalid date format", async () => {
      const title = "Birthday Party";
      const date = "invalid-date-format";
      const location = "My House";
      const ownerId = "123e4567-e89b-12d3-a456-426614174000";

      await expect(eventService.createEvent(title, date, location, ownerId)).rejects.toThrow("Invalid date format");

      expect(mockEventRepository.getByTitle).not.toHaveBeenCalled();
      expect(mockEventRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error for invalid location", async () => {
      const title = "Birthday Party";
      const date = "2025-12-25T20:00:00.000Z";
      const location = "A"; // Too short (min 2 characters)
      const ownerId = "123e4567-e89b-12d3-a456-426614174000";

      await expect(eventService.createEvent(title, date, location, ownerId)).rejects.toThrow();

      expect(mockEventRepository.getByTitle).not.toHaveBeenCalled();
      expect(mockEventRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error for invalid ownerId format", async () => {
      const title = "Birthday Party";
      const date = "2025-12-25T20:00:00.000Z";
      const location = "My House";
      const ownerId = "invalid-uuid-format";

      await expect(eventService.createEvent(title, date, location, ownerId)).rejects.toThrow();

      expect(mockEventRepository.getByTitle).not.toHaveBeenCalled();
      expect(mockEventRepository.create).not.toHaveBeenCalled();
    });
  });
});