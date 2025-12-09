import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { compareHash, generateEncryption, generateHash, S3Service, StorageEnum } from "src/common";
import { lean } from "src/DB";
import { type UserDocument } from "src/DB/models/user.model";
import { UserRepository } from "src/DB/repositories/user.repository";
import { UpdateAccountBodyDto, UpdatePasswordBodyDto } from "./dto/user.dto";
import { Types } from "mongoose";
import { RoleEnum } from "src/common/enums/user.enum";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
  ) { }
  
  async updateAccount(user: UserDocument, body: UpdateAccountBodyDto): Promise<UserDocument | lean<UserDocument>> {
    if (body.mobileNumber) {
      body.mobileNumber = await generateEncryption({ plainText: body.mobileNumber });
    }
    

    if (body.firstName && body.lastName) {
      user.userName = body.firstName + " " + body.lastName;
    } else if (body.firstName) {
      user.userName = body.firstName + " " + user.lastName;
    } else if (body.lastName) {
      user.userName = user.firstName + " " + body.lastName;
    }

    const updateUser = await this.userRepository.findOneAndUpdate({
      filter: {
        _id: user._id,
      },
      update: {
        ...body,
        userName: user.userName,
      }
    });

    if (!updateUser) {
      throw new BadRequestException("Fail to update your account");
    }

    return updateUser;
  }

  async getYourProfile(User: UserDocument): Promise<UserDocument | lean<UserDocument>> {
    const user = await this.userRepository.findOne({
      filter: {
        _id: User._id,
      },
    });
    if (!user) {
      throw new NotFoundException("Fail to find your account");
    }
    return user;
  }

  async getProfile(userId: Types.ObjectId): Promise<UserDocument | lean<UserDocument>> {

    const user = await this.userRepository.findOne({
      filter: {
        _id: userId,
      },
      select: {
        userName: 1,
        mobileNumber: 1,
        gender: 1,
        profilePic: {
          public_id: 1,
          secure_url: 1,
        },
        coverPic: {
          public_id: 1,
          secure_url: 1,
        },
      }
    });

    if (!user) {
      throw new NotFoundException("Fail to find user account");
    }

    return user;
  }

  async updatePassword(user: UserDocument, body: UpdatePasswordBodyDto):
    Promise<UserDocument | lean<UserDocument>> {
    
    if (!await compareHash(body.oldPassword, user.password)) {
      throw new BadRequestException("In-valid old password ");
    }

    const updatedUser = await this.userRepository.findOneAndUpdate({
      filter: {
        _id: user._id,
        isConfirmed: true
      },
      update: {
        changeCredentialTime: new Date(),
        password: await generateHash(body.newPassword),
      }
    });
   
    if (!updatedUser) {
      throw new NotFoundException("Fail to find user account");
    }

    return updatedUser;
  }

  async uploadProfilePic(user: UserDocument, file: Express.Multer.File): Promise<UserDocument> {
    user.profilePic.secure_url = await this.s3Service.uploadFile({
      storageApproach: StorageEnum.Disk,
      path: `user/${user._id.toString()}/profilePicture`,
      file
    });

    await user.save();
    return user;
  }

  async uploadCoverPic(user: UserDocument, files: Express.Multer.File[]): Promise<UserDocument> {

    const oldCoverPics = user.coverPic.map(url => url.secure_url);
    const coverPics = await this.s3Service.uploadFilesOrLargeFiles({
      storageApproach: StorageEnum.Disk,
      path: `users/${user.__v.toString()}/coverPic`,
      files
    });

  
    user.coverPic = coverPics.map(url => ({
      secure_url: url,
      public_id: url,
    }));
  
    await user.save();
    if (!user) {
      throw new BadRequestException("Fail to upload profile cover Images");
    }

    if (oldCoverPics.length) {
      await this.s3Service.deleteFiles({
        urls: oldCoverPics
      });
    }


    return user;
  }

  async deleteProfilePic(user: UserDocument):
    Promise<UserDocument | lean<UserDocument>> {
    await this.s3Service.deleteFile({
      Key: user.profilePic.secure_url,
    });

    const updateUser = await this.userRepository.updateOne({
      filter: {
        _id: user._id,
      },
      update: {
        $set: { profilePic: null },
      }
    });

    if (!updateUser.matchedCount) {
      throw new BadRequestException("Fail to delete profile picture");
    }
    return user;
  }

  async deleteCoverPic(user: UserDocument):
    Promise<UserDocument | lean<UserDocument>> {
    const oldCoverPics = user.coverPic.map(url => url.secure_url);

    await this.s3Service.deleteFiles({
      urls: oldCoverPics,
    });

    const updateUser = await this.userRepository.updateOne({
      filter: {
        _id: user._id,
      },
      update: {
        $set: { coverPic: null },
      }
    });

    if (!updateUser.matchedCount) {
      throw new BadRequestException("Fail to delete profile picture");
    }
    return user;
  }

  async softDeleteAccount(user: UserDocument, userId: Types.ObjectId): Promise<string> {
    if (user.role !== RoleEnum.Admin && userId) {
      throw new BadRequestException("Not authorized user");
    }
    const updatedUser = await this.userRepository.updateOne({
      filter: {
        _id: userId || user._id,

      },
      update: {
        deletedAt: new Date(),
        changeCredentialTime: new Date(),
        updatedBy: user._id,
      }
    });

    if (!updatedUser.matchedCount) {
      throw new BadRequestException("Fail to delete this account");
    }

    return "Done";
  }
}
