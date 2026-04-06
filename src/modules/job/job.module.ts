import { forwardRef, Module } from "@nestjs/common";
import {
  ApplicationModel,
  ApplicationRepository,
  CompanyModel,
  CompanyRepository,
  JobModel,
  JobRepository,
} from "src/DB";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";
import { RealTimeGateway } from "../gateway/gateway";
import { RealTimeModule } from "../gateway/gateway.module";
import { ChatModule } from "../chat/chat.module";


@Module({
  imports: [JobModel, ApplicationModel, CompanyModel, ChatModule, forwardRef(() => RealTimeModule)],
  controllers: [JobController],
  providers: [
    JobRepository,
    ApplicationRepository,
    JobService,
    CompanyRepository,
  ],
  exports: [],
})
export class JobModule {}
