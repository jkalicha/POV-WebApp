import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export class S3Service {
  private s3: AWS.S3;
  private bucketName: string;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME!;
  }

  public async uploadPhoto(file: Buffer, originalName: string): Promise<string> {
    const fileExtension = originalName.split('.').pop();
    const fileName = `photos/${uuidv4()}.${fileExtension}`;

    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: file,
      ContentType: `image/${fileExtension}`,
      ACL: 'public-read' // Para que las fotos sean públicas
    };

    const result = await this.s3.upload(params).promise();
    return result.Location;
  }

  public async deletePhoto(imageUrl: string): Promise<void> {
    // Extraer la key del URL de S3
    const key = imageUrl.split('/').slice(-2).join('/'); // photos/uuid.jpg
    
    const params = {
      Bucket: this.bucketName,
      Key: key
    };

    await this.s3.deleteObject(params).promise();
  }
}
