export interface IEventService {
    createEvent(title: string, date: Date, location: string, ownerId: string): Promise<void>;
}