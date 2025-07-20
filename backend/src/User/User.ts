import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    private id: string;

    @Column()
    private name: string;

    @Column({ unique: true })
    private email: string;

    @Column()
    private password: string;

    constructor(id: string, name: string, email: string, password: string) {
        // Validate inputs here --> check if email & password are valid
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public getPassword(): string {
        return this.password;
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setEmail(email: string): void {
        // Validate email before setting
        this.email = email;
    }

    public setPassword(password: string): void {
        // Validate password before setting
        this.password = password;
    }
}