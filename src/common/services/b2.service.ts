import { BadRequestException } from "@nestjs/common";
import { StorageEnum } from "../enums";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import B2 from "backblaze-b2";

export class S3Service {
    private b2: B2;
    constructor() {
        this.b2 = new B2({
            applicationKeyId: process.env.KEY_ID as string,
            applicationKey: process.env.APPLICATION_KEY as string
        });
    }

    getB2UploadUrl = async (
        {
            BucketId = process.env.BUCKET_ID
        }:
            {
                BucketId?: string
        }) : Promise<string> => {
        const uploadUrl = await this.b2.getUploadUrl({
            bucketId: BucketId as string,
        }) as unknown as string;

        if (!uploadUrl) {
             throw new BadRequestException("Fail to generate upload key");
        }
        return uploadUrl;
    }

//  uploadFile = async ({
//      uploadUrl: 'uploadUrl',
//     uploadAuthToken: 'uploadAuthToken',
//     fileName: 'fileName',
//     contentLength: 0, // optional data length, will default to data.byteLength or data.length if not provided
//     mime: '', // optional mime type, will default to 'b2/x-auto' if not provided
//     data: 'data', // this is expecting a Buffer, not an encoded string
//     hash: 'sha1-hash',
// }: {
//      uploadUrl: 'uploadUrl',
//     uploadAuthToken: 'uploadAuthToken',
//     fileName: 'fileName',
//     contentLength: 0, // optional data length, will default to data.byteLength or data.length if not provided
//     mime: '', // optional mime type, will default to 'b2/x-auto' if not provided
//     data: 'data', // this is expecting a Buffer, not an encoded string
//     hash: 'sha1-hash',
// }):Promise<string> => {

    
// }

//   uploadLargeFile = async ({
//     storageApproach = StorageEnum.Memory,
//     Bucket = process.env.AWS_BUCKET_NAME as string,
//     ACL = "private",
//     path = "general",
//     file
// }: {
//     storageApproach?: StorageEnum,
//     Bucket?: string,
//     ACL?: ObjectCannedACL,
//     path?: string,
//     file: Express.Multer.File
// }): Promise<string> => {
//     const upload = new Upload({
//         client: this.s3Client,
//         params: {
//             Bucket,
//             ACL,
//             Key: `${process.env.APPLICATION_NAME}/${path}/${randomUUID()}_${file.originalname}`,
//             Body: storageApproach === StorageEnum.Memory ? file.buffer : createReadStream(file.path),
//             ContentType: file.mimetype
//         }
//     });

//     upload.on('httpUploadProgress', (progress) => {
//       console.log(`Upload file progress is ::: ${progress}`);
//     });

//     const { Key } = await upload.done();
//      if (!Key) {
//       throw new BadRequestException('Fail to generate upload key');
//     }
//     return Key;
// }

//   uploadFilesOrLargeFiles = async ({
//     storageApproach = StorageEnum.Memory,
//     Bucket = process.env.AWS_BUCKET_NAME as string,
//     ACL = 'private',
//     path = 'general',
//     files,
//     useLarge
// }: {
//     storageApproach?: StorageEnum,
//     Bucket?: string,
//     ACL?: ObjectCannedACL,
//     path?: string,
//     files: Express.Multer.File[],
//     useLarge?: boolean
// }):Promise<string[]> => {
   
//     let urls: string[] = [];

//     if (useLarge) {
//         urls = await Promise.all(files.map((file) => {
//             return this.uploadLargeFile({
//                 storageApproach,
//                 Bucket,
//                 ACL,
//                 path,
//                 file
//             });
//         }));
//     } else {
//         urls = await Promise.all(files.map((file) => {
//             return this.uploadFile({
//                 storageApproach,
//                 Bucket,
//                 ACL,
//                 path,
//                 file
//             });
//         })
//         );
//     }

//         return urls;
// }

//   preUploadSignedUrl = async ({ 
//     Bucket = process.env.AWS_BUCKET_NAME as string,
//     path = 'general',
//     originalname,
//     ContentType,
//     ExpiresIn = 120
// }: {
//     Bucket?: string,
//     path?: string,
//         originalname: string,
//         ContentType: string,
//    ExpiresIn?:number
// }): Promise<{ url: string, key: string }> => {
    
//     const command = new PutObjectCommand({
//         Bucket,
//         Key: `${process.env.APPLICATION_NAME}/${path}/${randomUUID()}_pre_${originalname}`,
//         ContentType
//     });
//     const url = await getSignedUrl(this.s3Client, command, { expiresIn: ExpiresIn });
    
//     if (!url || !command?.input?.Key) {
//         throw new BadRequestException("Fail to generate preSignedUrl");
//     }
//     return { url, key: command.input.Key };
// }
 
//   getFile = async ({
//     Bucket = process.env.AWS_BUCKET_NAME as string,
//     Key
// }: {
//     Bucket?: string,
//     Key: string
// }) => {
//     const command = new GetObjectCommand({
//         Bucket,
//         Key
//     });
//     return this.s3Client.send(command);
// }

//   createPreSignedGetUrl = async({
//     Bucket = process.env.AWS_BUCKET_NAME as string,
//     Key,
//     ExpiresIn = 120,
//       download = false,
//       filename = '',
// }: {
//     Bucket?: string,
//     Key?: string,
//     ExpiresIn?: number,
//           download?: boolean,
//           filename?: string,
// }): Promise<string > => {
    
//     const command = new GetObjectCommand({
//         Bucket,
//         Key,
//         ResponseContentDisposition: download ? `attachments; filename="${filename || Key?.split("/").pop()}"` : undefined
//     });
//     const url = await getSignedUrl(this.s3Client, command, { expiresIn: ExpiresIn });
    
//     if (!url ) {
//         throw new BadRequestException("Fail to generate preSignedUrl");
//     }
//     return url;
// }

//   deleteFile = async ({
//     Bucket = process.env.AWS_BUCKET_NAME as string,
//     Key
// }: {
//     Bucket?: string,
//     Key?: string
// }): Promise<DeleteObjectCommandOutput> => {
//     const command = new DeleteObjectCommand({
//         Bucket,
//         Key
//     });
//     return await this.s3Client.send(command);
// }

//   deleteFiles = async ({
//         Bucket = process.env.AWS_BUCKET_NAME as string,
//         urls = [],
//         Quiet = false
//     }: {
//         Bucket?: string,
//         urls: string[],
//         Quiet?: boolean
    
//     }): Promise<DeleteObjectsCommandOutput> => {
    
//         const Objects = urls.map(url => {
//             return { Key: url };
//         });
//         const command = new DeleteObjectsCommand({
//             Bucket,
//             Delete: {
//                 Objects,
//                 Quiet
//             }
//         });
//         return await this.s3Client.send(command);
//     }

//    listDirectoryFiles = async ({
//     Bucket = process.env.AWS_BUCKET_NAME as string,
//     path = "general"
// }: {
//     Bucket?: string,
//     path: string
    
// }): Promise<ListObjectsV2CommandOutput> => {
//     const command = new ListObjectsV2Command({
//         Bucket,
//         Prefix: `${process.env.APPLICATION_NAME}/${path}`
//     });
//     return this.s3Client.send(command);
//     }
    
//   deleteFolderByPrefix = async({
//     Bucket = process.env.AWS_BUCKET_NAME as string,
//     path="general",
//     Quiet = false
// }: {
//     Bucket?: string,
//     path: string,
//     Quiet?: boolean
    
//       }): Promise<DeleteObjectsCommandOutput> => {
//     const files = await this.listDirectoryFiles({ Bucket,path});
//         if (!files.Contents?.length) {
//       throw new BadRequestException("Empty Directory");
//         }
//     const urls: string[] = files.Contents.map((file) => {
//         return file.Key;
//     }) as string[];
//     return await this.deleteFiles({ Bucket, urls, Quiet });
// }
}