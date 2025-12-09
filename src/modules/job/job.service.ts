import { Injectable } from "@nestjs/common";
import { ApplicationRepository, JobRepository } from "src/DB";

@Injectable()
export class JobService {
    constructor(
        private readonly jobRepository: JobRepository,
        private readonly applicationRepository: ApplicationRepository,
    ) { }
    
    async addJob() {
        
    }

    async updateJob() {

    }

    async deleteJob() {

    }

    async getAllJobsForCompany() {

    }

    async getJob() {

    }

    async getAllJobs() {

    }

    async getAllApplications() {
        
    }

    async applyToJob() {
        
    }

    async acceptOrRejectApplication() {
        
    }


}