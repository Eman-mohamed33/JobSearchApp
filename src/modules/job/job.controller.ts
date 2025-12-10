import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { JobService } from "./job.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { successResponse, User } from "src/common";
import { type UserDocument } from "src/DB/models/user.model";
import { CreateJobBodyDto } from "./dto/job.dto";
import { JobResponse } from "./entities/job.entity";

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("company/:companyId/job")
export class JobController {
    constructor(private readonly jobService: JobService) { }
    
    @Auth([])
    @Post("/")
    async addJob(
        @User() user: UserDocument,
        @Body() body: CreateJobBodyDto,
    ) {
        const job = await this.jobService.addJob(user, body);
        return successResponse<JobResponse>({ status: 201, data: { job } });
    }

    @Auth([])
    async updateJob() {

    }

     @Auth([])
    async deleteJob() {

    }

    @Get("{/:jobId}")
    async getAllJobsForCompany() {

    }

    async getJob() {

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
