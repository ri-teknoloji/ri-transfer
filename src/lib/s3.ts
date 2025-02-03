import {
  DeleteObjectCommand,
  HeadObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

class S3Service {
  bucketName: string = process.env.AWS_BUCKET_NAME || "";
  s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
      endpoint: process.env.AWS_ENDPOINT,
      region: "auto",
    });
  }

  async createFile(key: string, file: Buffer) {
    const command = new PutObjectCommand({
      Body: file,
      Bucket: this.bucketName,
      Key: key,
    });

    const res = await this.s3.send(command);
    return res;
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const res = await this.s3.send(command);
    return res;
  }

  async hasFile(key: string): Promise<boolean> {
    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
      return true;
    } catch {
      return false;
    }
  }

  async listBuckets() {
    const response = await this.s3.send(new ListBucketsCommand({}));
    return response.Buckets;
  }
}

const s3 = new S3Service();
export default s3;
