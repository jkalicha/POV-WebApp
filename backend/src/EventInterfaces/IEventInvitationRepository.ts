export interface IEventInvitationRepository {
  getEventIdsByUserId(userId: string): Promise<string[]>;
  createMany(eventId: string, userIds: string[]): Promise<void>;
  exists(eventId: string, userId: string): Promise<boolean>;
}