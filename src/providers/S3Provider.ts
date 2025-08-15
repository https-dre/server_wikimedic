import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { BadRequest } from "../error-handler";

export type PublicObject = {
	id: string;
	name: string;
	createdAt: Date;
};

export type S3Object = {
	key: string;
	url?: string;
	size?: number;
	lastModified?: Date;
};

type s3ObjejctProps = {
  key: string,
  bucket: string;
  content: Buffer | Uint8Array | Blob | string;
  contentType: string;
}

export class S3Provider {
  private s3client: S3Client;
  constructor() {
    this.s3client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async putObject(object: s3ObjejctProps) {
    const command = new PutObjectCommand({
      Bucket: object.bucket,
      Key: object.key,
      Body: object.content,
      ContentType: object.contentType,
    });
  
    const response = await this.s3client.send(command);
    const cmd_status = response.$metadata.httpStatusCode;
    if (cmd_status !== 201 && cmd_status !== 200) {
      console.log(response.$metadata);
      throw new BadRequest(
        `Failed to upload file to S3, command status: ${cmd_status}`,
        500
      );
    }
  }

  async listObjects(bucket: string, prefix?: string) {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });
  
    try {
      const response = await this.s3client.send(command);
  
      if (response.Contents) {
        const list: S3Object[] = response.Contents.map((object: any) => {
          return {
            key: object?.Key!,
            url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${object.Key}`,
            size: object.Size,
            lastModified: object.LastModified,
          };
        });
  
        return list;
      }
    } catch (error) {
      throw new BadRequest(`failed in ListCommand: ${error} `, 500);
    }
  
    return [];
  }

  async deleteObject(bucket: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
  
    try {
      await this.s3client.send(command);
    } catch (error) {
      throw new BadRequest(`failed in DeleteCommand: ${error} `, 500);
    }  
  }

  async getObject(bucket: string, key: string) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
  
    try {
      const response = await this.s3client.send(command);
      return {
        key: key,
        url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        size: response.ContentLength,
        lastModified: response.LastModified,
      };
    } catch (error: any) {
      //console.log(error);
      if (error.name === "NoSuchKey") {
        return null;
      }
      throw new BadRequest(`failed in GetObjectCommand: ${error} `, 500);
    }
  }
}

