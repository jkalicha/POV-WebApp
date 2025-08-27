export interface IEventService {
    createEvent(title: string, date: string, location: string, ownerId: string): Promise<void>;
}