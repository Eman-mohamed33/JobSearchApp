import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { S3Service } from "src/common";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, S3Service],
  exports: [],
})
export class UserModule {}
