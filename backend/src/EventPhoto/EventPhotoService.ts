import { IEventPhotoRepository } from "../EventPhotoInterfaces/IEventPhotoRepository";
import { IEventPhotoService } from "../EventPhotoInterfaces/IEventPhotoService";
import { S3Service } from "./S3Service";
import { z } from "zod";

const PHOTO_LIMIT = 5; // Límite de 5 fotos por usuario por evento

export class EventPhotoService implements IEventPhotoService {
  private eventPhotoRepository: IEventPhotoRepository;
  private s3Service: S3Service;

  constructor(eventPhotoRepository: IEventPhotoRepository) {
    this.eventPhotoRepository = eventPhotoRepository;
    this.s3Service = new S3Service();
  }

  public async uploadPhoto(
    eventId: string, 
    userId: string, 
    file: Buffer, 
    originalName: string, 
    caption?: string
  ): Promise<void> {
    // Validar UUIDs
    const schema = z.object({
      eventId: z.string().uuid(),
      userId: z.string().uuid(),
    });
    
    const parsed = schema.safeParse({ eventId, userId });
    if (!parsed.success) {
      throw new Error("Invalid eventId or userId format");
    }

    // Verificar límite de fotos
    const currentCount = await this.eventPhotoRepository.countByUserAndEvent(userId, eventId);
    if (currentCount >= PHOTO_LIMIT) {
      throw new Error(`Límite de ${PHOTO_LIMIT} fotos por evento alcanzado`);
    }

    // Subir a S3
    const imageUrl = await this.s3Service.uploadPhoto(file, originalName);

    // Guardar en DB
    await this.eventPhotoRepository.create({
      eventId,
      userId,
      imageUrl,
      caption
    });
  }

  public async getPhotosForEvent(eventId: string): Promise<any[]> {
    const schema = z.string().uuid();
    const parsed = schema.safeParse(eventId);
    if (!parsed.success) {
      throw new Error("Invalid eventId format");
    }

    return this.eventPhotoRepository.getByEventId(eventId);
  }

  public async deletePhoto(photoId: string, userId: string): Promise<void> {
    const schema = z.object({
      photoId: z.string().uuid(),
      userId: z.string().uuid(),
    });
    
    const parsed = schema.safeParse({ photoId, userId });
    if (!parsed.success) {
      throw new Error("Invalid photoId or userId format");
    }

    // Verificar que la foto existe y pertenece al usuario
    const photo = await this.eventPhotoRepository.getById(photoId);
    if (!photo) {
      throw new Error("Foto no encontrada");
    }
    
    if (photo.userId !== userId) {
      throw new Error("No tienes permisos para eliminar esta foto");
    }

    // Eliminar de S3
    await this.s3Service.deletePhoto(photo.imageUrl);

    // Eliminar de DB
    await this.eventPhotoRepository.deleteById(photoId);
  }

  public async getUserPhotoCount(userId: string, eventId: string): Promise<number> {
    return this.eventPhotoRepository.countByUserAndEvent(userId, eventId);
  }
}
