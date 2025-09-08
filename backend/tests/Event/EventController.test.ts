import { EventController } from "../../src/Event/EventController";
import { IEventService } from "../../src/EventInterfaces/IEventService";
import { Event } from "../../src/Event/Event";

describe("EventController", () => {
  let eventController: EventController;
  let mockEventService: jest.Mocked<IEventService>;

  beforeEach(() => {
    mockEventService = {
      createEvent: jest.fn(),
      getEventsForUser: jest.fn(),
      inviteUsersToEvent: jest.fn(),
    } as jest.Mocked<IEventService>;
    eventController = new EventController(mockEventService);
  });

  describe("getEventsForUser", () => {
    it("should return events from eventService", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000";
      const ownerEvent = new Event("Evento Propio", new Date(), "Casa", userId);
      const invitedEvent = new Event(
        "Evento Invitado",
        new Date(),
        "Salon",
        "otro"
      );
      const mockResult = {
        owner: [ownerEvent],
        invited: [invitedEvent],
      };
      mockEventService.getEventsForUser.mockResolvedValue(mockResult);

      const result = await eventController.getEventsForUser(userId);
      expect(mockEventService.getEventsForUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResult);
    });
  });

  describe("createEvent", () => {
    it("should delegate to eventService", async () => {
      const title = "Birthday Party";
      const date = "2025-12-25T20:00:00.000Z";
      const location = "My House";
      const ownerId = "123e4567-e89b-12d3-a456-426614174000";

      mockEventService.createEvent.mockResolvedValue(undefined);

      await eventController.createEvent(title, date, location, ownerId);

      expect(mockEventService.createEvent).toHaveBeenCalledWith(
        title,
        date,
        location,
        ownerId
      );
      expect(mockEventService.createEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("inviteUsersToEvent", () => {
    it("should delegate to eventService and return result", async () => {
      const ownerId = "123e4567-e89b-12d3-a456-426614174000";
      const eventId = "123e4567-e89b-12d3-a456-426614174001";
      const emails = ["a@test.com", "b@test.com"]; 

      const mockResult = {
        invited: ["u1", "u2"],
        skipped: [] as Array<{ email: string; reason: string }>,
      };
      mockEventService.inviteUsersToEvent.mockResolvedValue(mockResult);

      const result = await eventController.inviteUsersToEvent(ownerId, eventId, emails);

      expect(mockEventService.inviteUsersToEvent).toHaveBeenCalledWith(ownerId, eventId, emails);
      expect(result).toEqual(mockResult);
    });
  });
});
