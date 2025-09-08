import { AppDataSource } from "../Database/AppDataSource";
import { IEventInvitationRepository } from "../EventInterfaces/IEventInvitationRepository";
import { EventInvitation } from "./EventInvitation";

export class EventInvitationRepository implements IEventInvitationRepository {
  private invitationRepository = AppDataSource.getRepository(EventInvitation);

  public async getEventIdsByUserId(userId: string): Promise<string[]> {
    const invitations = await this.invitationRepository.findBy({ userId });
    return invitations.map((inv) => inv.eventId);
  }

  public async createMany(eventId: string, userIds: string[]): Promise<void> {
    if (userIds.length === 0) return;
    const uniqueUserIds = Array.from(new Set(userIds));

    const toCreate: EventInvitation[] = [];
    for (const userId of uniqueUserIds) {
      const exists = await this.exists(eventId, userId);
      if (!exists) {
        const inv = new EventInvitation();
        inv.eventId = eventId;
        inv.userId = userId;
        toCreate.push(inv);
      }
    }
    if (toCreate.length > 0) {
      await this.invitationRepository.save(toCreate);
    }
  }

  public async exists(eventId: string, userId: string): Promise<boolean> {
    const found = await this.invitationRepository.findOne({
      where: { eventId, userId },
    });
    return !!found;
  }
}
