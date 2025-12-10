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

@Module({
  imports: [JobModel, ApplicationModel, CompanyModel],
  controllers: [JobController],
  providers: [JobRepository, ApplicationRepository, JobService, CompanyRepository, S3Service],
  exports: [],
})
export class JobModule {}
