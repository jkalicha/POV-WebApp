import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ unique: true })
    title: string;

    @Column()
    date: Date;

    @Column()
    location: string;

    @Column()
    ownerId: string;

    constructor(title?: string, date?: Date, location?: string, ownerId?: string) {
        this.title = title || '';
        this.date = date || new Date();
        this.location = location || '';
        this.ownerId = ownerId || '';
    }
}