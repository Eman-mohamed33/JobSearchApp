import { Controller, UsePipes, ValidationPipe } from "@nestjs/common";
import { JobService } from "./job.service";
import { Auth } from "src/common/decorators/auth.decorator";

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("job")
export class JobController {
    constructor(private readonly jobService: JobService) { }
    
    @Auth([])
    async addJob() {
        
    }

    @Auth([])
    async updateJob() {

    }

     @Auth([])
    async deleteJob() {

    }

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
