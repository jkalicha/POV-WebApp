export interface IEventInvitationRepository {
  getEventIdsByUserId(userId: string): Promise<string[]>;
}