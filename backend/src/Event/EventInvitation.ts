import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class EventInvitation {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    eventId!: string;

    @Column()
    userId!: string;
}