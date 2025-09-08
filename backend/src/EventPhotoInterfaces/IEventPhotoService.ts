export interface IEventPhotoService {
  uploadPhoto(eventId: string, userId: string, file: Buffer, originalName: string, caption?: string): Promise<void>;
  getPhotosForEvent(eventId: string): Promise<any[]>;
  deletePhoto(photoId: string, userId: string): Promise<void>;
  getUserPhotoCount(userId: string, eventId: string): Promise<number>;
}
