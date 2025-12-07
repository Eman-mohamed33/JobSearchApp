import { Module } from "@nestjs/common";
import { CompanyModel, CompanyRepository } from "src/DB";
import { CompanyService } from "./company.service";
import { CompanyController } from "./company.controller";

@Module({
  imports: [CompanyModel],
  controllers: [CompanyController],
  providers: [CompanyRepository, CompanyService],
  exports: [],
})
export class CompanyModule {}
