import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { JobService } from "./job.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { IResponse, successResponse, User } from "src/common";
import { type UserDocument } from "src/DB/models/user.model";
import { CreateJobBodyDto, GetAllDto } from "./dto/job.dto";
import { JobResponse } from "./entities/job.entity";
import { RoleEnum } from "src/common/enums/user.enum";
import { CompanyParamDto } from "../company/dto/company.dto";

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("company/:companyId/job")
export class JobController {
    constructor(private readonly jobService: JobService) { }
    
    @Auth([])
    @Post("/")
    async addJob(
        @User() user: UserDocument,
        @Body() body: CreateJobBodyDto,
    ): Promise<IResponse<JobResponse>> {
        const job = await this.jobService.addJob(user, body);
        return successResponse<JobResponse>({ status: 201, data: { job } });
    }

    @Auth([])
    @Patch("/")
    async updateJob(
        @User() user: UserDocument,
        @Body() body: CreateJobBodyDto,
    ): Promise<IResponse> {
        const message = await this.jobService.updateJob(user, body);
        return successResponse({ status: 200, message });
    }

    @Auth([RoleEnum.User])
    async deleteJob(
        @User() user: UserDocument,
    ): Promise<IResponse> {
        const message = await this.jobService.deleteJob(user);
        return successResponse({ status: 200, message });
    }

    @Get("{/:jobId}")
    async getAllJobsForCompany() {

    }

    async getJob(
        @Param() param: CompanyParamDto,
        @Query() query: GetAllDto,
        
    ) {

    }

    async getAllJobs() {

    }

     @Auth([])
    async getAllApplications() {
        
    }

     @Auth([])
    async applyToJob() {
        
    }

     @Auth([])
    async acceptOrRejectApplication() {
        
    }
}
