import { Body, Controller, Get, Param, Patch, Post, Query, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { JobService } from "./job.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { IApplication, IJob, IResponse, StatusEnum, successResponse, User } from "src/common";
import { type UserDocument } from "src/DB/models/user.model";
import { CreateJobBodyDto, GetAllDto, JobParamDto, UpdateJobBodyDto } from "./dto/job.dto";
import { ApplicationResponse, JobResponse } from "./entities/job.entity";
import { RoleEnum } from "src/common/enums/user.enum";
import { CompanyParamDto } from "../company/dto/company.dto";
import { GetAllResponse } from "src/common/entities/response.entity";
import { type Response } from "express";

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("company/:companyId/job")
export class JobController {
    constructor(private readonly jobService: JobService) { }
    
    @Get("applications-file")
    async allApplicationsInExcelSheet(
        @Param() param: CompanyParamDto,
        @Res() res: Response,
        @Query("date") query: Date,
    ) {
        const buff = await this.jobService.allApplicationsInExcelSheet(param.companyId, query);
         res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=applications.xlsx",
    });

        res.send(buff);
        
    }
    
    @Auth([RoleEnum.Admin, RoleEnum.User])
    @Post("/")
    async addJob(
        @User() user: UserDocument,
        @Body() body: CreateJobBodyDto,
        @Param() param:JobParamDto,
    ): Promise<IResponse<JobResponse>> {
        const job = await this.jobService.addJob(user, body, param.companyId);
        return successResponse<JobResponse>({ status: 201, data: { job } });
    }

    @Auth([RoleEnum.Admin, RoleEnum.User])
    @Patch("/:jobId")
    async updateJob(
        @User() user: UserDocument,
        @Body() body: UpdateJobBodyDto,
        @Param() param:JobParamDto,
    ): Promise<IResponse> {
        const message = await this.jobService.updateJob(user, body, param.jobId, param.companyId);
        return successResponse({ status: 200, message });
    }

    @Auth([RoleEnum.Admin, RoleEnum.User])
    @Patch("/:jobId/delete")
    async deleteJob(
        @User() user: UserDocument,
        @Param() param: JobParamDto,
    ): Promise<IResponse> {
        const message = await this.jobService.deleteJob(user, param);
        return successResponse({ status: 200, message });
    }

    @Get("{/:jobId}")
    async getAllJobsForCompany(
        @Param() param: JobParamDto,
        @Query() query: GetAllDto,
    ): Promise<IResponse<JobResponse | GetAllResponse<IJob>>> {
        if (param.jobId) {
            const job = await this.jobService.getOneJobForSCompany(param);
             return successResponse<JobResponse>({ status: 200, data: { job } });
        }
        else {
            const result = await this.jobService.getAllJobsOrOneJobForSCompany(param, query);
            return successResponse<GetAllResponse<IJob>>({ status: 200, data: { result } });
        }
    }


    @Get("/")
    async getAllJobs(
         @Param() param: JobParamDto,
        @Query() query: GetAllDto,
    ) : Promise<IResponse<GetAllResponse<IJob>>> {
        const result = await this.jobService.getAllJobs(param, query);
        return successResponse<GetAllResponse<IJob>>({ status: 200, data: { result } });
    }

    @Auth([RoleEnum.Admin, RoleEnum.User])
        @Get(":jobId/applications")
    async getAllApplications(
         @User() user: UserDocument,
        @Param() param: JobParamDto,
        @Query() query:GetAllDto,
    ):Promise<IResponse<GetAllResponse<IApplication>>> {
        const result = await this.jobService.getAllApplications(user, param, query);
        return successResponse<GetAllResponse<IApplication>>({ status: 200, data: { result } });
    }

    @Auth([RoleEnum.User])
    @Post(":jobId/apply")
    async applyToJob(
        @User() user: UserDocument,
        @Param() param:JobParamDto,
    ): Promise<IResponse<ApplicationResponse>> {
        const application = await this.jobService.applyToJob(user, param.jobId, param.companyId);
        return successResponse<ApplicationResponse>({ status: 201, data: { application } });
    }

    @Auth([RoleEnum.Admin, RoleEnum.User])
    @Patch(":jobId/:userId")
     async acceptOrRejectApplication(
         @User() user: UserDocument,
         @Param() param: JobParamDto,
         @Query('status') query: StatusEnum,
     ): Promise<IResponse<ApplicationResponse>>{
         const application = await this.jobService.acceptOrRejectApplication(user, param, query);
        return successResponse<ApplicationResponse>({ status: 201, data: { application } });
    }

    
}

