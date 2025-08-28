import { AppDataSource } from "../Database/AppDataSource";
import { IEventInvitationRepository } from "../EventInterfaces/IEventInvitationRepository";
import { EventInvitation } from "./EventInvitation";

export class EventInvitationRepository implements IEventInvitationRepository {
    private invitationRepository = AppDataSource.getRepository(EventInvitation);

    public async getEventIdsByUserId(userId: string): Promise<string[]> {
        const invitations = await this.invitationRepository.findBy({ userId });
        return invitations.map(inv => inv.eventId);
    }
}