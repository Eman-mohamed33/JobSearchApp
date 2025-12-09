import { Module } from "@nestjs/common";
import { ApplicationModel, ApplicationRepository, JobModel, JobRepository } from "src/DB";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";

@Module({
  imports: [JobModel, ApplicationModel],
  controllers: [JobController],
    providers: [JobRepository, ApplicationRepository, JobService],
  exports: [],
})
export class JobModule {}
