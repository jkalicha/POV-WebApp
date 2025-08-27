import { IEventRepository } from "../Shared/IEventRepository";
import { IEventService } from "../EventInterfaces/IEventService";
import { Event } from "./Event";
import { z } from "zod";

const CreateEventSchema = z.object({
    title: z.string().min(2).max(100),
    date: z.string().transform((str) => {
        const date = new Date(str);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
        }
        return date;
    }),
    location: z.string().min(2).max(100),
    ownerId: z.uuid()
});

export class EventService implements IEventService {
    private eventRepository: IEventRepository;

    constructor(eventRepository: IEventRepository) {
        this.eventRepository = eventRepository;
    }

    public async createEvent(title: string, date: string, location: string, ownerId: string): Promise<void> {
        const parsedData = CreateEventSchema.safeParse({ title, date, location, ownerId });
        if (!parsedData.success) {
            throw new Error(parsedData.error.issues.map((issue) => issue.message).join(", "));
        }
        const existingEvent = await this.eventRepository.getByTitle(parsedData.data.title);
        if (existingEvent) {
            throw new Error(`Event with title "${parsedData.data.title}" already exists.`);
        }
        const event = new Event(parsedData.data.title, parsedData.data.date, parsedData.data.location, parsedData.data.ownerId);
        await this.eventRepository.create(event);
    }
}