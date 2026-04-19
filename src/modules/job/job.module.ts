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
import { RealTimeModule } from "../gateway/gateway.module";
import { ChatModule } from "../chat/chat.module";
import { CloudinaryService } from "src/common/services/cloudinary.service";
@Module({
  imports: [JobModel, ApplicationModel, CompanyModel, ChatModule, forwardRef(() => RealTimeModule)],
  controllers: [JobController],
  providers: [
    JobRepository,
    ApplicationRepository,
    JobService,
    CompanyRepository,
    CloudinaryService,
  ],
  exports: [],
})
export class JobModule {}
