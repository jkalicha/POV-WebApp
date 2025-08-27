import { IRepository } from "./IRepository";
import { Event } from "../Event/Event";

export interface IEventRepository extends IRepository<Event> {
    getByTitle(title: string): Promise<Event | null>;
}