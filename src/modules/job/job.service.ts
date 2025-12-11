import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ApplicationDocument, ApplicationRepository, CompanyRepository, JobDocument, JobRepository, lean } from "src/DB";
import { CreateJobBodyDto, GetAllDto } from "./dto/job.dto";
import { UserDocument } from "src/DB/models/user.model";
import { Types } from "mongoose";
import { S3Service, StatusEnum, StorageEnum } from "src/common";
import { emailEvent } from "src/common/utils/events/email.event";
import { UserRepository } from "src/DB/repositories/user.repository";
@Injectable()
export class JobService {
    constructor(
        private readonly jobRepository: JobRepository,
        private readonly applicationRepository: ApplicationRepository,
        private readonly companyRepository: CompanyRepository,
        private readonly s3Service: S3Service,
        private readonly userRepository: UserRepository,
    ) { }
    
    async addJob(user: UserDocument, body: CreateJobBodyDto):
        Promise<JobDocument | lean<JobDocument>> {
        const company = await this.companyRepository.findOne({
            filter: {
                $or: [
                    { createdBy: user._id, },
                    { hRs: user._id },
                ],
                approvedByAdmin: true,
            }
        });

        if (!company) {
            throw new NotFoundException("Sorry, Adding job by company owner or HR");
        }

        const [job] = await this.jobRepository.create({
            data: [{
                ...body,
                companyId: company._id,
                addedBy: user._id,
            }]
        })

        if (!job) {
            throw new BadRequestException("Fail to add new Job to this company");
        }

        return job;
    }

    async updateJob(user: UserDocument, body: CreateJobBodyDto):
        Promise<string> {
        const job = await this.jobRepository.findOne({
            filter: {
                addedBy: user._id,
            },
        });

        if (!job) {
            throw new NotFoundException("Job not exist");
        }

        const updatedJob = await this.jobRepository.updateOne({
            filter: {
                addedBy: user._id,
            },
            update: {
                ...body,
                updatedBy: user._id,

            },
        })

        if (!updatedJob.matchedCount) {
            throw new BadRequestException("Fail to update this Job");
        }

        return "Job updated successfully";
    }

    async deleteJob(user: UserDocument):
        Promise<string> {
        const company = await this.companyRepository.findOne({
            filter: {
                hRs: user._id,
            }
        })
        if (!company) {
            throw new NotFoundException("Company Not Exist or You're not company hr")
        }
        const job = await this.jobRepository.deleteOne({
            filter: {
                companyId: company?._id,
            }
        });

        if (!job) {
            throw new NotFoundException("Fail to delete this job");
        }

        return "Job deleted successfully";
    }

    async getOneJobForSCompany(companyId: Types.ObjectId, jobId: Types.ObjectId):
        Promise<JobDocument | lean<JobDocument>> {
        const job = await this.jobRepository.findOne({
            filter: {
                companyId,
                _id: jobId,
            }
        });

        if (!job) {
            throw new NotFoundException("Job not exist or deleted");
        }

        return job;
    }

    async getAllJobsOrOneJobForSCompany(companyId: Types.ObjectId, query: GetAllDto, jobId: Types.ObjectId)
        : Promise<JobDocument | lean<JobDocument> |
        {
            docsCount?: number,
            pages?: number,
            currentPage?: number | string,
            limit?: number,
            result: JobDocument[] | [] | lean<JobDocument>[],
  }> {
        
        if (jobId) {
         return await this.getOneJobForSCompany(companyId, jobId);
        }
        const { page, size } = query;
        const jobs = await this.jobRepository.paginate({
            filter: {
                companyId,
            },
            page,
            size,
            options: {
                sort: { createdAt: 1 },
            }
        });

        if (!jobs.result) {
            throw new NotFoundException("The company has no job openings.");
        }

        return jobs;
    }    

    async getAllJobs(companyId: Types.ObjectId, query: GetAllDto):
        Promise<{
            docsCount?: number,
            pages?: number,
            currentPage?: number | string,
            limit?: number,
            result: JobDocument[] | lean<JobDocument>[],
        }> {
        const { page, search, size } = query;
        const jobs = await this.jobRepository.paginate({
            filter: {
                companyId,
                $or: [
                    { workingTime: { $regex: search, $options: "i" } },
                    { jobDescription: { $regex: search, $options: "i" } },
                    { jobTitle: { $regex: search, $options: "i" } },
                    { seniorityLevel: { $regex: search, $options: "i" } },
                    { technicalSkills: { $regex: search, $options: "i" } },
                ]
            },
            page,
            size,
            options: {
                sort: { createdAt: 1 },
            }
        });

        if (!jobs.result) {
            throw new NotFoundException("The company has no job openings.");
        }

        return jobs;
    }

    async getAllApplications(user: UserDocument, companyId: Types.ObjectId, query: GetAllDto, jobId: Types.ObjectId):
        Promise<{
            docsCount?: number,
            pages?: number,
            currentPage?: number | string,
            limit?: number,
            result: JobDocument[] | lean<JobDocument>[],
        }> {

        const company = await this.companyRepository.findOne({
            filter: {
                _id: companyId,
                $or: [
                    { createdBy: user._id },
                    { hRs: user._id },
                ]
            }
        });

        if (!company) {
            throw new NotFoundException("Company not exist");
        }
        const { page, size } = query;
        const applications = await this.jobRepository.paginate({
            filter: {
                jobId,
                
            },
            page,
            size,
            options: {
                sort: { createdAt: 1 },
                populate: [{
                    path: "applications",
                    populate: [{
                        path: "userId"
                    }]
                }]
            }
        });

        if (!applications) {
            throw new NotFoundException("The company has no job openings.");
        }

        return applications;
    }

    async applyToJob
        (user: UserDocument, jobId: Types.ObjectId,
            companyId: Types.ObjectId, file: Express.Multer.File):
        Promise<ApplicationDocument> {
           const job = await this.jobRepository.findOne({
            filter: {
                _id: jobId,
                companyId,
            }
        });

        if (!job) {
            throw new NotFoundException("Fail to find this job");
        }
        
        const Cv = await this.s3Service.uploadFile({
            storageApproach: StorageEnum.Disk,
            file,
            path: `company/${companyId.toString()}/job/${jobId.toString()}cVs`,
        });

        const [application] = await this.applicationRepository.create({
            data: [{
                userId: user._id,
                jobId: jobId,
                userCv: {
                    secure_url: Cv,
                    public_id: Cv,
                }
                
            }]
        });

     


        return application;
    }

    async acceptOrRejectApplication(user: UserDocument, userId: Types.ObjectId, jobId: Types.ObjectId,
        companyId: Types.ObjectId, status: StatusEnum) {
        const findUser = await this.userRepository.findOne({
            filter: {
                _id: userId,
            }
        })

        if (!findUser) {
            throw new NotFoundException("user not found");
        }

        const company = await this.companyRepository.findOne({
            filter: {
                _id: companyId,
                hRs: user._id,
            }
        });
        if (!company) {
            throw new BadRequestException("You're not one of the company's HR staff.");
        }
        const application = await this.applicationRepository.findOneAndUpdate({
            filter: {
                jobId,
                status: StatusEnum.Pending,
                userId,
            },
            update: {
                status,
            }
        })

        if (!application) {
            throw new NotFoundException("application not exist");
        }
        if (application?.status === StatusEnum.Accepted) {
            emailEvent.emit("acceptApplication", {
                to: findUser.email,
                userName: findUser.userName,
                companyName: company.companyName,
            });
        }

        if (application?.status === StatusEnum.Rejected) {
            emailEvent.emit("rejectApplication", {
                to: findUser.email,
                userName: findUser.userName,
                companyName: company.companyName
            });
        }

        return application;
    }

}