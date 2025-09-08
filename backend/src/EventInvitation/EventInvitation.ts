import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity()
@Unique(["eventId", "userId"]) // Prevent duplicate invitations for the same user and event
export class EventInvitation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  eventId!: string;

  @Column()
  userId!: string;
}
