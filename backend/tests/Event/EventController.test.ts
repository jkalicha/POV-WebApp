import { EventController } from "../../src/Event/EventController";
import { IEventService } from "../../src/Shared/IEventService";

describe("EventController", () => {
  let eventController: EventController;
  let mockEventService: jest.Mocked<IEventService>;

  beforeEach(() => {
    mockEventService = {
      createEvent: jest.fn(),
    };

    eventController = new EventController(mockEventService);
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
});