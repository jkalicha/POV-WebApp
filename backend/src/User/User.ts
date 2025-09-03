
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    constructor(name?: string, email?: string, password?: string, id?: string) {
        if (name) this.name = name;
        if (email) this.email = email;
        if (password) this.password = password;
        if (id) this.id = id;
    }
}