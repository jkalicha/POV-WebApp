import { IRepository } from "./IRepository";
import { Event } from "../Event/Event";

export interface IEventRepository extends IRepository<Event> {
    createEvent(title: string, date: Date, location: string, ownerId: string): Promise<void>;
}