import { Module } from "@nestjs/common";
import { CompanyModel, CompanyRepository } from "src/DB";
import { CompanyService } from "./company.service";
import { CompanyController } from "./company.controller";
import { S3Service } from "src/common";

@Module({
  imports: [CompanyModel],
  controllers: [CompanyController],
  providers: [CompanyRepository, CompanyService, S3Service],
  exports: [],
})
export class CompanyModule {}
