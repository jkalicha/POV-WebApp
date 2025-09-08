import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

export class MockS3Service {
  private uploadDir: string;

  constructor() {
    // Crear directorio para almacenar imágenes localmente
    this.uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  public async uploadPhoto(file: Buffer, originalName: string): Promise<string> {
    const fileExtension = originalName.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);
    
    // Escribir archivo al sistema local
    await fs.promises.writeFile(filePath, file);
    
    // Retornar URL local
    return `http://localhost:3000/uploads/${fileName}`;
  }

  public async deletePhoto(imageUrl: string): Promise<void> {
    try {
      const fileName = path.basename(imageUrl);
      const filePath = path.join(this.uploadDir, fileName);
      
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.warn('Error deleting file:', error);
      // No lanzar error para no romper la funcionalidad
    }
  }
}
