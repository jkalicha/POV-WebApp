import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Event {
    @PrimaryGeneratedColumn('uuid')
    private _id?: string;

    @Column({ unique: true })
    private _title: string;

    @Column()
    private _date: Date;

    @Column()
    private _location: string;

    @Column()
    private _ownerId: string;

    constructor(title?: string, date?: Date, location?: string, ownerId?: string) {
        this._title = title || '';
        this._date = date || new Date();
        this._location = location || '';
        this._ownerId = ownerId || '';
    }

    // Getters
    public get id(): string | undefined {
        return this._id;
    }

    public get title(): string {
        return this._title;
    }

    public get date(): Date {
        return this._date;
    }

    public get location(): string {
        return this._location;
    }

    public get ownerId(): string {
        return this._ownerId;
    }

    // Setters
    public set title(title: string) {
        this._title = title;
    }

    public set date(date: Date) {
        this._date = date;
    }

    public set location(location: string) {
        this._location = location;
    }

    public set ownerId(ownerId: string) {
        this._ownerId = ownerId;
    }
}