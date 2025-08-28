import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../User/User';
import { Event } from '../Event/Event';
import { EventInvitation } from "../Event/EventInvitation";

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'pov_webapp',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Event, EventInvitation],
});
