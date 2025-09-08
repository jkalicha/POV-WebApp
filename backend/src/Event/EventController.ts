import { IEventService } from "../EventInterfaces/IEventService";

export class EventController {
  private _eventService: IEventService;

  constructor(eventService: IEventService) {
    this._eventService = eventService;
  }

  async createEvent(title: string, date: string, location: string, ownerId: string): Promise<void> {
    await this._eventService.createEvent(title, date, location, ownerId);
  }

  async getEventsForUser(userId: string) {
    return this._eventService.getEventsForUser(userId);
  }

  async inviteUsersToEvent(ownerId: string, eventId: string, inviteeEmails: string[]) {
    return this._eventService.inviteUsersToEvent(ownerId, eventId, inviteeEmails);
  }
}