export interface IEventPhotoRepository {
  create(eventPhoto: { eventId: string; userId: string; imageUrl: string; caption?: string }): Promise<void>;
  getByEventId(eventId: string): Promise<any[]>;
  getByUserId(userId: string): Promise<any[]>;
  countByUserAndEvent(userId: string, eventId: string): Promise<number>;
  deleteById(id: string): Promise<void>;
  getById(id: string): Promise<any | null>;
}
