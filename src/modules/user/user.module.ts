import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AdminResolver } from "./admin.resolver";
import { CompanyModel, CompanyRepository } from "src/DB";
import { CloudinaryService } from "src/common/services/cloudinary.service";

@Module({
  imports: [CompanyModel],
  controllers: [UserController],
  providers: [UserService, AdminResolver, CompanyRepository, CloudinaryService],
  exports: [],
})
export class UserModule {}
