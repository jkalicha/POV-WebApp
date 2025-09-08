import { IEventPhotoService } from "../EventPhotoInterfaces/IEventPhotoService";

export class EventPhotoController {
  private eventPhotoService: IEventPhotoService;

  constructor(eventPhotoService: IEventPhotoService) {
    this.eventPhotoService = eventPhotoService;
  }

  public async uploadPhoto(
    eventId: string,
    userId: string,
    file: Buffer,
    originalName: string,
    caption?: string
  ): Promise<void> {
    await this.eventPhotoService.uploadPhoto(eventId, userId, file, originalName, caption);
  }

  public async getEventPhotos(eventId: string): Promise<any[]> {
    return this.eventPhotoService.getPhotosForEvent(eventId);
  }

  public async deletePhoto(photoId: string, userId: string): Promise<void> {
    await this.eventPhotoService.deletePhoto(photoId, userId);
  }

  public async getUserPhotoCount(userId: string, eventId: string): Promise<number> {
    return this.eventPhotoService.getUserPhotoCount(userId, eventId);
  }
}
