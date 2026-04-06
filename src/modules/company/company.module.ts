import { Module } from "@nestjs/common";
import { CompanyModel, CompanyRepository } from "src/DB";
import { CompanyService } from "./company.service";
import { CompanyController } from "./company.controller";
import { CloudinaryService } from "src/common/services/cloudinary.service";

@Module({
  imports: [CompanyModel],
  controllers: [CompanyController],
  providers: [CompanyRepository, CompanyService, CloudinaryService],
  exports: [],
})
export class CompanyModule {}
