import { Body, Controller, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { CloudFileUpload, fileValidation } from "src/common/utils/multer";
import { IResponse, StorageEnum, successResponse, User } from "src/common";
import { CompanyResponse } from "./entities/company.entity";
import { AddCompanyBodyDto, CompanyParamDto, SearchQueryDto, UpdateCompanyBodyDto } from "./dto/company.dto";
import { type UserDocument } from "src/DB/models/user.model";

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("company")
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }
    
    @UseInterceptors(
        FileInterceptor(
            'document',
            CloudFileUpload({
                storageApproach: StorageEnum.Disk,
                validation: fileValidation.document || fileValidation.image,
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

    @Patch(":companyId/update-company-data")
    async updateCompanyData(
        @Body() body: UpdateCompanyBodyDto,
        @User() user: UserDocument,
        @Param() param: CompanyParamDto,
    ): Promise<IResponse<CompanyResponse>> {
        const company = await this.companyService.updateCompanyData(param.companyId, user, body);
        return successResponse<CompanyResponse>({ status: 200, data: { company } });
    }


    @Get(":companyId")
    async GetSpecificCompanyWithRelatedJobs(
        @Param() param: CompanyParamDto,
    ): Promise<IResponse<CompanyResponse>> {
        const company = await this.companyService.GetSpecificCompanyWithRelatedJobs(param.companyId);
        return successResponse<CompanyResponse>({ status: 200, data: { company } });
    }


    @Get()
    async searchForACompany(
        @Query() query: SearchQueryDto,
   ): Promise<IResponse<CompanyResponse>>{
        const company = await this.companyService.searchForACompany(query);
        return successResponse<CompanyResponse>({ status: 200, data: { company } });
    }


    @Patch(":companyId/delete")
    async softDeleteCompany(
        @User() user: UserDocument,
        @Param() param: CompanyParamDto,
    ): Promise<IResponse> {
        const message = await this.companyService.softDeleteCompany(user, param.companyId);
        return successResponse({ status: 200, message });
    }


    @UseInterceptors(
        FileInterceptor(
            'picture',
            CloudFileUpload({
                validation: fileValidation.image,
            })))
    @Patch("upload-logo-picture")
    async uploadLogoPic(
        @User() user: UserDocument,
        @Param() param: CompanyParamDto,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File,
    ): Promise<IResponse<CompanyResponse>> {
        const company = await this.companyService.uploadLogoPic(user, param.companyId, file);
        return successResponse<CompanyResponse>({ status: 200, data: { company } });
    }


     @Patch(":companyId/delete-logo-picture")
    async deleteLogoPic(
        @User() user: UserDocument,
        @Param() param: CompanyParamDto,
    ): Promise<IResponse<CompanyResponse>> {
        const company = await this.companyService.deleteLogoPic(user, param.companyId);
        return successResponse<CompanyResponse>({ status: 200, data: { company } });
    }


    @UseInterceptors(
        FilesInterceptor(
            'coverPictures',
            4,
            CloudFileUpload({
                validation: fileValidation.image,
                storageApproach: StorageEnum.Disk,
            })))
    @Patch("upload-cover-pictures")
    async uploadCoverPic(
        @Param() param: CompanyParamDto,
        @User() user: UserDocument,
        @UploadedFiles(ParseFilePipe) files: Express.Multer.File[],
    ): Promise<IResponse<CompanyResponse>> {
        const company = await this.companyService.uploadCoverPic(user, param.companyId, files);
        return successResponse<CompanyResponse>({ status: 200, data: { company } });
    }


    // @Patch(":companyId/delete-cover-pictures")
    // async deleteCoverPic(
    //     @User() user: UserDocument,
    //     @Param() param: CompanyParamDto,
    // ): Promise<IResponse<CompanyResponse>> {
    //     const company = await this.companyService.deleteCoverPic(user, param.companyId);
    //     return successResponse<CompanyResponse>({ status: 200, data: { company } });
    // }
}