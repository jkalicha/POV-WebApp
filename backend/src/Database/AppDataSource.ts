import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../User/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'pov_webapp',
  synchronize: true,
  logging: true,
  entities: [User],
});
