import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { S3Service } from "src/common";
import { AdminResolver } from "./admin.resolver";
import { CompanyModel, CompanyRepository } from "src/DB";

@Module({
  imports: [CompanyModel],
  controllers: [UserController],
  providers: [UserService, S3Service, AdminResolver, CompanyRepository],
  exports: [],
})
export class UserModule {}
