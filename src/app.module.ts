import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";
import { join, resolve } from "node:path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SharedAuthenticationModule } from "./common/modules/authentication.module";
import { AuthenticationModule } from "./modules/authentication/auth.module";
import { UserModule } from "./modules/user/user.module";
import { CompanyModule } from "./modules/company/company.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { JobModule } from "./modules/job/job.module";
import { RealTimeModule } from "./modules/gateway/gateway.module";
import { ChatModule } from "./modules/chat/chat.module";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60 * 60000,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({
      envFilePath: resolve("./config/.env.production"),
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI as string, {
      serverSelectionTimeoutMS: 30000,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    }),
    SharedAuthenticationModule,
    AuthenticationModule,
    UserModule,
    CompanyModule,
    JobModule,
    RealTimeModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
