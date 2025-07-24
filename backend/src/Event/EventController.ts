import { IEventService } from "../Shared/IEventService";

export class EventController {
  private _eventService: IEventService;

  constructor(eventService: IEventService) {
    this._eventService = eventService;
  }

  async createEvent(title: string, date: string, location: string, ownerId: string): Promise<void> {
    await this._eventService.createEvent(title, date, location, ownerId);
  }
}