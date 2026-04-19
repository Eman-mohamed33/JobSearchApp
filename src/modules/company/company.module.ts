import { Module } from "@nestjs/common";
import {
  ApplicationModel,
  ApplicationRepository,
  CompanyModel,
  CompanyRepository,
  JobModel,
  JobRepository,
} from "src/DB";
import { CompanyService } from "./company.service";
import { CompanyController } from "./company.controller";
import { CloudinaryService } from "src/common/services/cloudinary.service";

@Module({
  imports: [CompanyModel, JobModel, ApplicationModel],
  controllers: [CompanyController],
  providers: [
    CompanyRepository,
    CompanyService,
    CloudinaryService,
    JobRepository,
    ApplicationRepository,
  ],
  exports: [],
})
export class CompanyModule {}
