import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";
import { resolve } from "node:path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SharedAuthenticationModule } from "./common/modules/authentication.module";
import { AuthenticationModule } from "./modules/authentication/auth.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60 * 60000,
          limit: 2000,
        },
      ],
    }),
    ConfigModule.forRoot({
      envFilePath: resolve("./config/.env.development"),
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI as string, {
      serverSelectionTimeoutMS: 30000,
    }),
    SharedAuthenticationModule,
    AuthenticationModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
