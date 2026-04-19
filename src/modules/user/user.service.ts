import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { compareHash, generateEncryption, generateHash } from "src/common";
import { lean } from "src/DB";
import { type UserDocument } from "src/DB/models/user.model";
import { UserRepository } from "src/DB/repositories/user.repository";
import { UpdateAccountBodyDto, UpdatePasswordBodyDto } from "./dto/user.dto";
import { Types } from "mongoose";
import { RoleEnum } from "src/common/enums/user.enum";
import { CloudinaryService } from "src/common/services/cloudinary.service";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
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
        isConfirmed:true,
      },
      select: {
        firstName: 1,
        lastName:1,
        mobileNumber: 1,
        profilePic: 1,
        coverPic: 1,
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
    const profilePic = await this.cloudinaryService.uploadFile({
      path: `user/${user._id.toString()}/profilePic`,
      file: file.path,
    });

    const updatedUser = await this.userRepository.findOneAndUpdate({
      filter: {
        _id: user._id,
      },
      update: {
        profilePic,
      },
      options: {
        new: false,
      }
    });

    if (updatedUser?.profilePic?.public_id) {
      await this.cloudinaryService.destroyFile({
        public_id: updatedUser.profilePic.public_id,
      });
    }

    if (!updatedUser) {
      throw new BadRequestException("Fail to upload profile picture");
    }
    return user;
  }

  async uploadCoverPic(user: UserDocument, files: Express.Multer.File[]): Promise<UserDocument> {

    const oldCoverPics = user.coverPic.map(picture => {
      return picture.public_id;
    });

    user.coverPic = await this.cloudinaryService.uploadFiles({
      files: files.map(file => file.path),
      path: `user/${user._id.toString()}/coverPics`
    });
   
  
    await user.save();
    if (!user) {
      throw new BadRequestException("Fail to upload profile cover Images");
    }

    if (oldCoverPics.length) {
      await this.cloudinaryService.deleteResources({
        public_ids: oldCoverPics
      });
    }


    return user;
  }

  async deleteProfilePic(user: UserDocument):
    Promise<UserDocument | lean<UserDocument>> {
    await this.cloudinaryService.destroyFile({
      public_id: user.profilePic.public_id,
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
    const oldCoverPics = user.coverPic.map(picture => {
      return picture.public_id;
    });

    await this.cloudinaryService.deleteResources({
      public_ids: oldCoverPics
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
    if (user.role !== RoleEnum.Admin && user._id.toString() !== userId.toString()) {
      throw new BadRequestException("Not authorized user");
    }
    const updatedUser = await this.userRepository.findOneAndUpdate({
      filter: {
        _id: userId || user._id,
        isConfirmed:true,

      },
      update: {
        deletedAt: new Date(),
        changeCredentialTime: new Date(),
        updatedBy: user._id,
      }
    });

    if (!updatedUser) {
      throw new BadRequestException("Fail to delete this account");
    }

    return "Done";
  }
}
