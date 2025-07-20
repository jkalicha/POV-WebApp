import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../User/User';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'localhost',
  port: 1433,
  username: 'jkalicha',
  password: '1234',
  database: 'POV-WebApp',
  synchronize: true, // Makes sure the database schema is in sync with the entities
  logging: true,
  entities: [User],
  options: {
    encrypt: false
  }
});