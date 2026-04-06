// import { BadRequestException } from "@nestjs/common";
// import { StorageEnum } from "../enums";
// import { randomUUID } from "crypto";
// import { createReadStream } from "fs";
import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { IPicture } from "../interfaces";

export interface fileKeys { public_id: string; secure_url: string; }
@Injectable()
export class CloudinaryService {
    constructor() {
     
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
            secure: true
        });
        
    }


    uploadFile = async (
        {
            file = "",
            path = "general"
        }: {
            file: string;
            path: string;
        }): Promise<fileKeys> => {
        return await cloudinary.uploader.upload(file, {
            folder: `${process.env.APPLICATION_NAME}/${path}`
        });
    }



    destroyFile = async ({ public_id = "" }: { public_id: string;}) => {
    return await cloudinary.uploader.destroy(public_id);
};

 uploadFiles = async ({ files = [], path = "general" } = {}) => {
     const attachments: IPicture[] = [];
    for (const file of files) {
        const { public_id, secure_url } = await this.uploadFile({ file, path });
        attachments.push({ public_id, secure_url });
    }
    return attachments;
};

  deleteResources = async ({ public_ids = [],
    options = {
        type: "upload",
        resource_type:"image"
    }
} = {}) => {
    return await cloudinary.api.delete_resources(public_ids, options);
};

  deleteFolderByPrefix = async ({
    prefix = ""
} = {}) => {
    return await cloudinary.api.delete_resources_by_prefix(`${process.env.APPLICATION_NAME}/${prefix}`);
};


}

