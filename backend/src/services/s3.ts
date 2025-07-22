import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '@/config';
import { logger } from '@/utils/logger';

class S3Service {
  private client: S3Client;
  private bucketName: string;

  constructor() {
    this.client = new S3Client({ region: config.aws.region });
    this.bucketName = config.aws.s3.bucketName;
  }

  async generateUploadUrl(key: string, contentType: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      const uploadUrl = await getSignedUrl(this.client, command, { expiresIn });
      logger.info('S3 upload URL generated', { key, contentType });
      return uploadUrl;
    } catch (error) {
      logger.error('S3 generateUploadUrl error', { key, contentType, error });
      throw error;
    }
  }

  async generateDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const downloadUrl = await getSignedUrl(this.client, command, { expiresIn });
      logger.info('S3 download URL generated', { key });
      return downloadUrl;
    } catch (error) {
      logger.error('S3 generateDownloadUrl error', { key, error });
      throw error;
    }
  }

  async deleteObject(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(command);
      logger.info('S3 object deleted', { key });
    } catch (error) {
      logger.error('S3 deleteObject error', { key, error });
      throw error;
    }
  }

  generateFileKey(userId: string, fileName: string): string {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `users/${userId}/${timestamp}_${sanitizedFileName}`;
  }
}

export const s3Service = new S3Service();