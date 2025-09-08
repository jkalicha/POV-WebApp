import { IEventRepository } from "../EventInterfaces/IEventRepository";
import { IEventService } from "../EventInterfaces/IEventService";
import { Event } from "./Event";
import { z } from "zod";
import { IEventInvitationRepository } from "../EventInterfaces/IEventInvitationRepository";
import { IUserRepository } from "../UserInterfaces/IUserRepository";

const CreateEventSchema = z.object({
  title: z.string().min(2).max(100),
  date: z.string().transform((str) => {
    const date = new Date(str);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }
    return date;
  }),
  location: z.string().min(2).max(100),
  ownerId: z.uuid(),
});

export class EventService implements IEventService {
  private eventRepository: IEventRepository;
  private eventInvitationRepository: IEventInvitationRepository;
  private userRepository: IUserRepository;

  constructor(
    eventRepository: IEventRepository,
    eventInvitationRepository: IEventInvitationRepository,
    userRepository: IUserRepository
  ) {
    this.eventRepository = eventRepository;
    this.eventInvitationRepository = eventInvitationRepository;
    this.userRepository = userRepository;
  }

  public async getEventsForUser(
    userId: string
  ): Promise<{ owner: any[]; invited: any[] }> {
    const ownerEvents = await this.eventRepository.getByUserId(userId);
    const eventIds = await this.eventInvitationRepository.getEventIdsByUserId(
      userId
    );
    const invitedEvents =
      eventIds.length > 0 ? await this.eventRepository.getByIds(eventIds) : [];
    const onlyInvited = invitedEvents.filter(
      (e) => !ownerEvents.some((o) => o.id === e.id)
    );

    // Mapear a objetos planos usando las propiedades públicas
    const mapEvent = (e: any) => {
      return {
        id: e.id,
        title: e.title,
        date: e.date,
        location: e.location,
        ownerId: e.ownerId,
      };
    };

    return {
      owner: ownerEvents.map(mapEvent),
      invited: onlyInvited.map(mapEvent),
    };
  }

  public async createEvent(
    title: string,
    date: string,
    location: string,
    ownerId: string
  ): Promise<void> {
    const parsedData = CreateEventSchema.safeParse({
      title,
      date,
      location,
      ownerId,
    });
    if (!parsedData.success) {
      throw new Error(
        parsedData.error.issues.map((issue) => issue.message).join(", ")
      );
    }
    const existingEvent = await this.eventRepository.getByTitle(
      parsedData.data.title
    );
    if (existingEvent) {
      throw new Error(
        `Event with title "${parsedData.data.title}" already exists.`
      );
    }
    const event = new Event(
      parsedData.data.title,
      parsedData.data.date,
      parsedData.data.location,
      parsedData.data.ownerId
    );
    await this.eventRepository.create(event);
  }

  public async inviteUsersToEvent(
    ownerId: string,
    eventId: string,
    inviteeEmails: string[]
  ): Promise<{ invited: string[]; skipped: { email: string; reason: string }[] }> {
    const InviteSchema = z.object({
      eventId: z.string().uuid(),
      inviteeEmails: z.array(z.string().email()).min(1),
      ownerId: z.string().uuid(),
    });
    const parsed = InviteSchema.safeParse({ eventId, inviteeEmails, ownerId });
    if (!parsed.success) {
      throw new Error(
        parsed.error.issues.map((i) => i.message).join(", ")
      );
    }

    const event = await this.eventRepository.getById(eventId);
    if (!event) throw new Error("Invalid eventId");
    if (event.ownerId !== ownerId)
      throw new Error("Forbidden: Not allowed to invite to this event");

    const uniqueEmails = Array.from(new Set(inviteeEmails.map((e) => e.toLowerCase())));

    const invited: string[] = [];
    const skipped: { email: string; reason: string }[] = [];

    // Resolve emails to userIds
    for (const email of uniqueEmails) {
      const user = await this.userRepository.getByEmail(email);
      if (!user) {
        skipped.push({ email, reason: "Usuario no encontrado" });
        continue;
      }
      if (user.id === ownerId) {
        skipped.push({ email, reason: "El propietario no puede invitarse a sí mismo" });
        continue;
      }
      const alreadyInvited = await this.eventInvitationRepository.exists(eventId, user.id);
      if (alreadyInvited) {
        skipped.push({ email, reason: "Ya estaba invitado" });
        continue;
      }
      invited.push(user.id);
    }

    await this.eventInvitationRepository.createMany(eventId, invited);

    return {
      invited,
      skipped,
    };
  }
}
