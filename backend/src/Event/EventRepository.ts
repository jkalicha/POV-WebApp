import { In } from "typeorm";
import { AppDataSource } from "../Database/AppDataSource";
import { IEventRepository } from "../EventInterfaces/IEventRepository";
import { Event } from "./Event";

export class EventRepository implements IEventRepository {
  private eventRepository = AppDataSource.getRepository(Event);

  public async create(entity: Event): Promise<void> {
    await this.eventRepository.save(entity);
  }

  public async update(entity: Event): Promise<void> {
    await this.eventRepository.save(entity);
  }

  public async delete(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }

  public async getAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  public async getById(id: string): Promise<Event | null> {
    return this.eventRepository.findOneBy({ id });
  }

  public async getByTitle(title: string): Promise<Event | null> {
    return this.eventRepository.findOneBy({ title });
  }

  public async getByUserId(userId: string): Promise<Event[]> {
    return this.eventRepository.findBy({ ownerId: userId });
  }

  public async getByIds(ids: string[]): Promise<Event[]> {
    if (ids.length === 0) return [];
    return this.eventRepository.findBy({ id: In(ids) });
  }
}
