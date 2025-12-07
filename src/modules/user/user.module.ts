import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { S3Client } from "@aws-sdk/client-s3";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, S3Client],
  exports: [],
})
export class UserModule {}
