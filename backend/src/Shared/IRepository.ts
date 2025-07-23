export interface IRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}