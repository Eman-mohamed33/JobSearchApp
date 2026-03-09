import { Module } from "@nestjs/common";
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
import { S3Service } from "src/common";
import { RealTimeGateway } from "../gateway/gateway";

@Module({
  imports: [JobModel, ApplicationModel, CompanyModel],
  controllers: [JobController],
  providers: [
    JobRepository,
    ApplicationRepository,
    JobService,
    CompanyRepository,
    S3Service,
    RealTimeGateway,
  ],
  exports: [],
})
export class JobModule {}
