import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/DB/repositories/user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }
  
  async updateAccount() {
    
  }

  async getProfile() {

  }

  async updatePassword() {
    
  }

  async uploadProfilePic() {

  }

  async uploadCoverPic() {

  }

  async deleteProfilePic() {

  }

  async deleteCoverPic() {

  }

  async softDeleteAccount() {
    
  }
}
