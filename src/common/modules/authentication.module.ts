import { Global, Module } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { TokenService } from "../services/token.service";
import { UserRepository } from "src/DB/repositories/user.repository";
import { UserModel } from "src/DB/models/user.model";
import { TokenModel } from "src/DB/models/token.model";
import { TokenRepository } from "src/DB/repositories/token.repository";

@Global()
@Module({
  imports: [UserModel, TokenModel],
  exports: [UserRepository, TokenService, TokenRepository, JwtService, UserModel, TokenModel],
  controllers: [],
  providers: [UserRepository, TokenService, TokenRepository, JwtService],
})
export class SharedAuthenticationModule {}
