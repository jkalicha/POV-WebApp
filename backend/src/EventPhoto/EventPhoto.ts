import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "../Event/Event";
import { User } from "../User/User";

@Entity()
export class EventPhoto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  eventId!: string;

  @Column()
  userId!: string;

  @Column()
  imageUrl!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt!: Date;

  @Column({ nullable: true })
  caption?: string;

  // Relations (optional, for TypeORM queries)
  @ManyToOne(() => Event)
  @JoinColumn({ name: 'eventId' })
  event?: Event;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;
}
