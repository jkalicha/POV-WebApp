import { AppDataSource } from "../Database/AppDataSource";
import { IEventPhotoRepository } from "../EventPhotoInterfaces/IEventPhotoRepository";
import { EventPhoto } from "./EventPhoto";

export class EventPhotoRepository implements IEventPhotoRepository {
  private photoRepository = AppDataSource.getRepository(EventPhoto);

  public async create(data: { eventId: string; userId: string; imageUrl: string; caption?: string }): Promise<void> {
    const photo = new EventPhoto();
    photo.eventId = data.eventId;
    photo.userId = data.userId;
    photo.imageUrl = data.imageUrl;
    photo.caption = data.caption;
    
    await this.photoRepository.save(photo);
  }

  public async getByEventId(eventId: string): Promise<EventPhoto[]> {
    return this.photoRepository.find({ 
      where: { eventId },
      order: { uploadedAt: 'DESC' }
    });
  }

  public async getByUserId(userId: string): Promise<EventPhoto[]> {
    return this.photoRepository.find({ 
      where: { userId },
      order: { uploadedAt: 'DESC' }
    });
  }

  public async countByUserAndEvent(userId: string, eventId: string): Promise<number> {
    return this.photoRepository.count({ 
      where: { userId, eventId }
    });
  }

  public async deleteById(id: string): Promise<void> {
    await this.photoRepository.delete(id);
  }

  public async getById(id: string): Promise<EventPhoto | null> {
    return this.photoRepository.findOne({ where: { id } });
  }
}
