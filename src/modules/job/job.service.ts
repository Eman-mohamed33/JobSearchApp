import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ApplicationDocument, ApplicationRepository, CompanyRepository, JobDocument, JobRepository, lean } from "src/DB";
import { CreateJobBodyDto, GetAllDto, JobParamDto, UpdateJobBodyDto } from "./dto/job.dto";
import { UserDocument } from "src/DB/models/user.model";
import { Types } from "mongoose";
import { S3Service, StatusEnum } from "src/common";
import { emailEvent } from "src/common/utils/events/email.event";
import { UserRepository } from "src/DB/repositories/user.repository";
import { RealTimeGateway } from "../gateway/gateway";
import { createExcelSheet } from "src/common/utils/files/Excelsheet.file";


@Injectable()
export class JobService {
    constructor(
        private readonly jobRepository: JobRepository,
        private readonly applicationRepository: ApplicationRepository,
        private readonly companyRepository: CompanyRepository,
        private readonly s3Service: S3Service,
        private readonly userRepository: UserRepository,
        private readonly realTimeGateway: RealTimeGateway,
    ) { }
    
    async findCompanyById() {
        
    }
    async addJob(user: UserDocument, body: CreateJobBodyDto, companyId: Types.ObjectId):
        Promise<JobDocument | lean<JobDocument>> {
        const company = await this.companyRepository.findOne({
            filter: {
                $or: [
                    { createdBy: user._id, },
                    { hRs: user._id },
                ],
                approvedByAdmin: true,
                _id: companyId,
            }
        });

        if (!company) {
            throw new NotFoundException("Sorry, Adding job by company owner or HR Or this company is not approved");
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

    async updateJob(user: UserDocument, body: UpdateJobBodyDto, jobId: Types.ObjectId, companyId: Types.ObjectId):
        Promise<string> {
        const company = await this.companyRepository.findOne({
            filter: {
                $or: [
                    { createdBy: user._id, },
                    { hRs: user._id },
                ],
                approvedByAdmin: true,
                _id: companyId,
            }
        });

         if (!company) {
             throw new NotFoundException("Fail to find this company");
        }

        

       

        const updatedJob = await this.jobRepository.findOneAndUpdate({
            filter: {
                addedBy: user._id,
                _id: jobId,
                companyId:company._id,
            },
            update: {
                ...body,
                updatedBy: user._id,

            },
        })

        if (!updatedJob) {
            throw new NotFoundException("Job not exist Or Fail to update this Job");
        }

        return "Job updated successfully";
    }

    async deleteJob(user: UserDocument, param: JobParamDto):
        Promise<string> {
        
        const company = await this.companyRepository.findOne({
            filter: {
                _id: param.companyId,
                approvedByAdmin: true,
            }
        })

        console.log(company?.hRs);
        if (!company) {
            throw new NotFoundException("Company Not Exist or You're not company hr")
        }
        const job = await this.jobRepository.deleteOne({
            filter: {
                companyId: company?._id,
                _id: param.jobId,
            }
        });

        if (!job) {
            throw new NotFoundException("Fail to delete this job");
        }

        return "Job deleted successfully";
    }

    async getOneJobForSCompany(param: JobParamDto):
        Promise<JobDocument | lean<JobDocument>> {
        console.log(param.jobId);
        console.log(typeof param.jobId);

        const job = await this.jobRepository.findOne({
            filter: {
                _id: Types.ObjectId.createFromHexString(param.jobId.toString()),
                companyId: Types.ObjectId.createFromHexString(param.companyId.toString()),
              
            }
        });

        if (!job) {
            throw new NotFoundException("Job not exist or deleted");
        }

        return job;
    }

    async getAllJobsOrOneJobForSCompany(param:JobParamDto, query: GetAllDto)
        : Promise<{
            docsCount?: number,
            pages?: number,
            currentPage?: number | string,
            limit?: number,
            result: JobDocument[] | lean<JobDocument>[],
        }> {
        
        const { size, page } = query;
        const jobs = await this.jobRepository.paginate({
            filter: {
                companyId: Types.ObjectId.createFromHexString(param.companyId.toString()),
            },
            page,
            size,
            options: {
                sort: { createdAt: 1 },
            }
        });

        if (!jobs) {
            throw new NotFoundException("The company has no job openings.");
        }

        return jobs;
    }

    async getAllJobs(param: JobParamDto, query: GetAllDto):
        Promise<{
            docsCount?: number,
            pages?: number,
            currentPage?: number | string,
            limit?: number,
            result: JobDocument[] | lean<JobDocument>[],
        }> {
        const { page, size, search } = query;
        const jobs = await this.jobRepository.paginate({
            filter: {
                companyId: Types.ObjectId.createFromHexString(param.companyId.toString()),
                 ...(search ? {
                $or: [
                    { workingTime: { $regex: search, $options: "i" } },
                    { jobDescription: { $regex: search, $options: "i" } },
                    { jobTitle: { $regex: search, $options: "i" } },
                    { seniorityLevel: { $regex: search, $options: "i" } },
                    { technicalSkills: { $regex: search, $options: "i" } },
                     ]
                } : {}),
            },
            page,
            size,
            options: {
                sort: { createdAt: 1 },
            }
        });

        if (!jobs) {
            throw new NotFoundException("The company has no job openings.");
        }

        return jobs;
    }

    async getAllApplications(user: UserDocument, param:JobParamDto, query: GetAllDto):
        Promise<{
            docsCount?: number,
            pages?: number,
            currentPage?: number | string,
            limit?: number,
            result: ApplicationDocument[] | lean<ApplicationDocument>[],
        }> {

        const company = await this.companyRepository.findOne({
            filter: {
                _id: Types.ObjectId.createFromHexString(param.companyId.toString()),
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
        const applications = await this.applicationRepository.paginate({
            filter: {
                jobId: Types.ObjectId.createFromHexString(param.jobId.toString()),
                
            },
            page,
            size,
            options: {
                sort: { createdAt: 1 },
                populate: [{
                    path: "userId",
                }]
            }
        });

        if (!applications) {
            throw new NotFoundException("The company has no job applications.");
        }

        return applications;
    }

    async applyToJob(user: UserDocument, jobId: Types.ObjectId,
            companyId: Types.ObjectId):Promise<ApplicationDocument> {
        
            const job = await this.jobRepository.findOne({
                filter: {
                    _id: jobId,
                    
                }
            });
           

            if (!job) {
                throw new NotFoundException("Fail to find this job");
            }
        
            // const Cv = await this.s3Service.uploadFile({
            //     storageApproach: StorageEnum.Disk,
            //     file,
            //     path: `company/${companyId.toString()}/job/${jobId.toString()}cVs`,
            // });

            const [application] = await this.applicationRepository.create({
                data: [{
                    userId: user._id,
                    jobId: job._id,
                    // userCv: {
                    //     secure_url: Cv,
                    //     public_id: Cv,
                    // }
                
                }]
            });

        const notification = {
            title: "New Application Received! 🚀",
            message: `${user.userName} applied for ${job.jobTitle}`,
            payload: {
                jobId: job._id,
                applicationId: application._id,
                seekerId: user._id
            },
            timestamp: new Date()
        }
        

        this.realTimeGateway.Submitting_Notification(job.addedBy.toString(), notification);
        
            return application;
    
       
    
    }

    async acceptOrRejectApplication(user: UserDocument, param: JobParamDto,
        status: StatusEnum,
    ) {
        const findUser = await this.userRepository.findOne({
            filter: {
                _id: param.userId,
            }
        })


        const job = await this.jobRepository.findOne({
            filter: {
                _id: param.jobId,
                 addedBy: user._id,
            }
        })
        if (!job) {
            throw new BadRequestException("You're not one of the company's HR staff.");
        }

        console.log(typeof param.jobId);
        console.log(typeof param.companyId);
        console.log(typeof param.userId);
        
        
        const objectId = new Types.ObjectId(param.jobId);
        const objectId2 = new Types.ObjectId(param.userId);
   console.log(typeof param.jobId);
        console.log(typeof param.companyId);
        console.log(typeof param.userId);
        const application = await this.applicationRepository.findOneAndUpdate({
            filter: {
                jobId: objectId,
                 status: StatusEnum.Pending,
                 userId:objectId2,
            },
            update: {
                status,
            },
            options: {
                new: true,
            }
        })

        if (!application) {
            throw new NotFoundException("application not exist");
        }
        console.log('Comparison:', application.status === StatusEnum.Accepted)
        if (application.status === StatusEnum.Accepted) {
            console.log("lkkkkkkkkkkkkkkkk;;;;;;;kk");
            
            emailEvent.emit("acceptApplication", {
                to: findUser?.email,
                userName: findUser?.userName,
                companyName: job.companyId,
            });
        }

        if (application?.status === StatusEnum.Rejected) {
            emailEvent.emit("rejectApplication", {
                to: findUser?.email,
                userName: findUser?.userName,
                companyName: job.companyId
            });
        }

        return application;
    }

    async allApplicationsInExcelSheet(companyId: Types.ObjectId, date: Date) {
         console.log(companyId);
console.log(typeof companyId);
         
         const coId = new Types.ObjectId(companyId);

         const jobs = await this.jobRepository.find({
             filter: {
                 companyId: coId,
             }
         });

         if (!jobs) {
             throw new NotFoundException("Jobs not found");
         }

         const jobsIds: Types.ObjectId[] = [];

         
         jobs.forEach((job: JobDocument) => {
             jobsIds.push(job._id as unknown as Types.ObjectId)
         });
         console.log({ jobs });
        console.log({ date });
        date = new Date(date); 
        const isoDate  = date.toISOString();
        console.log({ isoDate  });
         
         console.log({jobsIds});
         
        const start = new Date(date);
        start.setHours(0,0,0,0);
        const end = new Date(date);
        end.setHours(23,59,59,999);
        console.log(date);
        
        console.log(start);
        console.log(end);
        
        
        const applications = await this.applicationRepository.find({
            filter: {
                jobId: { $in: jobsIds },
                createdAt: {
                    $gte: start,
                    $lte: end,
                },
            }
        });

         console.log({applications});
         
         if (!applications) {
             throw new NotFoundException("Applications not found");
         }

         const buffer = createExcelSheet("Applications", applications, [
             { header: "ID", key: "_id", width: 40 },
             { header: "UserId", key: "userId", width: 40 },
             { header: "JobId", key: "jobId", width: 40 },
             { header: "Status", key: "status", width: 40 },
             { header: "CreatedAt", key: "createdAt", width: 40 },
             { header: "UpdatedAt", key: "updatedAt", width: 40 },
         ]);

         return buffer;
        
    }

}