import { Event } from "../Event/Event";

export interface IEventService {
    createEvent(title: string, date: string, location: string, ownerId: string): Promise<void>;
    getEventsForUser(userId: string): Promise<{ owner: Event[]; invited: Event[] }>;
    inviteUsersToEvent(ownerId: string, eventId: string, inviteeEmails: string[]): Promise<{ invited: string[]; skipped: { email: string; reason: string }[] }>;
}