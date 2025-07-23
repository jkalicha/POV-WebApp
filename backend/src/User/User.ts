import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    private _id!: string;

    @Column()
    private _name!: string;

    @Column({ unique: true })
    private _email!: string;

    @Column()
    private _password!: string;

    constructor(name?: string, email?: string, password?: string, id?: string) {
        // Validate inputs here --> check if email & password are valid
        if (name) this._name = name;
        if (email) this._email = email;
        if (password) this._password = password;
        if (id) this._id = id;
    }

    // Getters
    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get email(): string {
        return this._email;
    }

    public get password(): string {
        return this._password;
    }

    // Setters
    public set name(value: string) {
        this._name = value;
    }

    public set email(value: string) {
        this._email = value;
    }

    public set password(value: string) {
        this._password = value;
    }
}