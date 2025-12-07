import { Body, Controller, ParseFilePipe, Patch, Post, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { CloudFileUpload, fileValidation } from "src/common/utils/multer";
import { IResponse, successResponse, User } from "src/common";
import { CompanyResponse } from "./entities/company.entity";
import { AddCompanyBodyDto } from "./dto/company.dto";
import { type UserDocument } from "src/DB/models/user.model";

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("company")
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }
    
    @UseInterceptors(
        FileInterceptor(
            'document',
            CloudFileUpload({
                validation: fileValidation.image,
            })))
    @Post("/")
    async addCompany(
        @Body() body: AddCompanyBodyDto,
        @User() user: UserDocument,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File,
    ): Promise<IResponse<CompanyResponse>>{
        const company = await this.companyService.addCompany(body, user, file);
        return successResponse<CompanyResponse>({ status: 201, data: { company } });
    }


    // @UseInterceptors(
    //     FileInterceptor(
    //         'picture',
    //         CloudFileUpload({
    //             validation: fileValidation.image,
    //         })))
    // @Patch("update-company-data")
    // async updateCompanyData(
    //     @Body() body: AddCompanyBodyDto,
    //     @User() user: UserDocument,
    //     @UploadedFile(ParseFilePipe) file: Express.Multer.File,
    // ): Promise<IResponse<CompanyResponse>>{
    //     const company = await this.companyService.updateCompanyData();
    //    // return successResponse<CompanyResponse>({ status: 201, data: { company } });
    // }


    // @UseInterceptors(
    //     FileInterceptor(
    //         'picture',
    //         CloudFileUpload({
    //             validation: fileValidation.image,
    //         })))
    // @Patch("update-company-data")
    // async uploadLogoPic(
    //     @Body() body: AddCompanyBodyDto,
    //     @User() user: UserDocument,
    //     @UploadedFile(ParseFilePipe) file: Express.Multer.File,
    // ): Promise<IResponse<CompanyResponse>>{
    //     const company = await this.companyService.uploadLogoPic();
    //    // return successResponse<CompanyResponse>({ status: 201, data: { company } });
    // }


    // @UseInterceptors(
    //     FilesInterceptor(
    //         'pictures',
    //         CloudFileUpload({
    //             validation: fileValidation.image,
    //         })))
    // @Patch("update-company-data")
    // async uploadCoverPic(
    //     @Body() body: AddCompanyBodyDto,
    //     @User() user: UserDocument,
    //     @UploadedFiles(ParseFilePipe) files: Express.Multer.File,
    // ): Promise<IResponse<CompanyResponse>>{
    //     const company = await this.companyService.uploadCoverPic();
    //     return successResponse<CompanyResponse>({ status: 201, data: { company } });
    // }



    

    
    

}