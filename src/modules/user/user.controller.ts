import { Body, Controller, Get, Param, ParseFilePipe, Patch, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { IResponse, StorageEnum, successResponse, User } from "src/common";
import { type UserDocument } from "src/DB/models/user.model";
import { UpdateAccountBodyDto, UpdatePasswordBodyDto, UserParamDto } from "./dto/user.dto";
import { UserResponse } from "./entities/user.entity";
import { CloudFileUpload, fileValidation } from "src/common/utils/multer";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { RoleEnum } from "src/common/enums/user.enum";
import { Auth } from "src/common/decorators/auth.decorator";

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) { }
  
 
  @Auth([RoleEnum.Admin, RoleEnum.User])
  @Patch("update-profile")
  async updateAccount(
    @User() user: UserDocument,
    @Body() body: UpdateAccountBodyDto,
  ): Promise<IResponse<UserResponse>> {
    const User = await this.userService.updateAccount(user, body);
    return successResponse<UserResponse>({ data: { User }, status: 200 })
  }

  
  @Auth([RoleEnum.Admin, RoleEnum.User])
  @Get("profile")
  async getYourProfile(
    @User() user: UserDocument,
  ): Promise<IResponse<UserResponse>> {
    const User = await this.userService.getYourProfile(user);
    return successResponse<UserResponse>({ data: { User }, status: 200 })
  }

  @Get(":userId")
  async getProfile(
    @Param() param: UserParamDto,
  ): Promise<IResponse<UserResponse>> {
    const User = await this.userService.getProfile(param.userId);
    return successResponse<UserResponse>({ data: { User }, status: 200 })
  }
  

  
  @Auth([RoleEnum.Admin, RoleEnum.User])
  @Patch("update-password")
  async updatePassword(
    @User() user: UserDocument,
    @Body() body: UpdatePasswordBodyDto,
  ): Promise<IResponse<UserResponse>> {
    const User = await this.userService.updatePassword(user, body);
    return successResponse<UserResponse>({ data: { User }, status: 200 })
  }


  @Auth([RoleEnum.Admin, RoleEnum.User])
  @UseInterceptors(
    FileInterceptor(
      'picture',
      CloudFileUpload({
        validation: fileValidation.image,
        storageApproach: StorageEnum.Disk,
      })))
  @Patch("profile-picture")
  async uploadProfilePic(
    @User() user: UserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ): Promise<IResponse<UserResponse>> {
    const User = await this.userService.uploadProfilePic(user, file);
    return successResponse<UserResponse>({ data: { User }, status: 200 })
  }
  

  
  @Auth([RoleEnum.Admin, RoleEnum.User])
  @UseInterceptors(
    FilesInterceptor(
      'coverPictures',
      4,
      CloudFileUpload({
        validation: fileValidation.image,
        storageApproach: StorageEnum.Disk,
      })))
  @Patch("cover-pictures")
  async uploadCoverPic(
    @User() user: UserDocument,
    @UploadedFiles(ParseFilePipe) files: Express.Multer.File[],
  ): Promise<IResponse<UserResponse>> {
    const User = await this.userService.uploadCoverPic(user, files);
    return successResponse<UserResponse>({ data: { User }, status: 200 })
  }


  @Patch("delete-profile-picture")
  async deleteProfilePic(
    @User() user: UserDocument,
  ): Promise<IResponse<UserResponse>> {
    const User = await this.userService.deleteProfilePic(user);
    return successResponse<UserResponse>({ data: { User }, status: 200 })
  }

  @Auth([RoleEnum.Admin])
  @Patch("delete-cover-pictures")
  async deleteCoverPic(
    @User() user: UserDocument,
  ): Promise<IResponse<UserResponse>> {
    const User = await this.userService.deleteCoverPic(user);
    return successResponse<UserResponse>({ data: { User }, status: 200 })
  }

  
  @Auth([RoleEnum.Admin, RoleEnum.User])
  @Patch(":userId/delete")
  async softDeleteAccount(
    @User() user: UserDocument,
    @Param() param: UserParamDto,
  ): Promise<IResponse> {
    const message = await this.userService.softDeleteAccount(user, param.userId);
    return successResponse<UserResponse>({ message, status: 200 });
  }

}
