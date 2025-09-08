import { AppDataSource } from "../Database/AppDataSource";
import { IEventInvitationRepository } from "../EventInterfaces/IEventInvitationRepository";
import { EventInvitation } from "./EventInvitation";

export class EventInvitationRepository implements IEventInvitationRepository {
    private invitationRepository = AppDataSource.getRepository(EventInvitation);

    async createMany(eventId: string, userIds: string[]): Promise<void> {
        const invitations = userIds.map(userId => {
            const invitation = this.invitationRepository.create({ eventId, userId });
            return invitation;
        });
        await this.invitationRepository.save(invitations);
    }

    async exists(eventId: string, userId: string): Promise<boolean> {
        const count = await this.invitationRepository.count({ where: { eventId, userId } });
        return count > 0;
    }

    public async getEventIdsByUserId(userId: string): Promise<string[]> {
        const invitations = await this.invitationRepository.findBy({ userId });
        return invitations.map(inv => inv.eventId);
    }
}