import { Controller, Get, Patch, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) { }
  
  @Patch("update-profile")
  async updateAccount(
    
  ) {
    
  }

  @Get("")
  async getProfile() {

  }

@Patch("update-password")
  async updatePassword() {
    
  }

  @Patch("profile-picture")
  async uploadProfilePic() {

  }

  @Patch("cover-picture")
  async uploadCoverPic() {

  }

  
  async deleteProfilePic() {

  }

  async deleteCoverPic() {

  }

  async softDeleteAccount() {
    
  }
}
