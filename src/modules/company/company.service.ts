import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ApplicationRepository, CompanyDocument, CompanyRepository, JobRepository, lean } from "src/DB";
import { UserDocument } from "src/DB/models/user.model";
import { AddCompanyBodyDto, SearchQueryDto, UpdateCompanyBodyDto } from "./dto/company.dto";
import { Types } from "mongoose";
import { RoleEnum } from "src/common/enums/user.enum";
import { CloudinaryService } from "src/common/services/cloudinary.service";

@Injectable()
export class CompanyService {
    constructor(
        private readonly companyRepository: CompanyRepository,
        private readonly cloudinaryService: CloudinaryService,
        private readonly applicationRepository: ApplicationRepository,
        private readonly jobRepository: JobRepository,
    ) { }
    
    async addCompany(body: AddCompanyBodyDto, user: UserDocument, file: Express.Multer.File): Promise<CompanyDocument>
    {
        
        const checkCompanyExist = await this.companyRepository.findOne({
            filter: {
                companyEmail: body.companyEmail,
                companyName: body.companyName,
            }
        });

        if (checkCompanyExist) {
            throw new ConflictException("This company is already exist");
        }

        body.numberOfEmployees = Number(body.numberOfEmployees);

        const legalAttachment = await this.cloudinaryService.uploadFile({
            file: file.path,
            path: `company/${user._id.toString()}/documents`,
        });

        const [company] = await this.companyRepository.create({
            data: [{
                ...body,
                createdBy: user._id,
                legalAttachment,
                approvedByAdmin: user.role === RoleEnum.Admin ? true : false,
            }]
        });

        if (!company) {
            throw new BadRequestException("Fail to add new company");
        }

        return company;
    }

    async updateCompanyData(companyId: Types.ObjectId, user: UserDocument,body:UpdateCompanyBodyDto):
        Promise<CompanyDocument | lean<CompanyDocument>>  {

     const updatedCompany=   await this.companyRepository.findOneAndUpdate({
            filter: {
                 _id: companyId,
                createdBy: user._id,
            },
            update: {
                ...body,
         },
         options: {
             new: false,
            }
     })
        
        
        if (!updatedCompany) {

            throw new NotFoundException("Company not exist Or Not Authorized Account");
        }

        return updatedCompany;
    }

    async GetSpecificCompanyWithRelatedJobs(companyId: Types.ObjectId):
        Promise<CompanyDocument | lean<CompanyDocument>> {
        const company = await this.companyRepository.findOne({
            filter: {
                _id: companyId,
            },
            options: {
                populate: [
                    {
                        path: "jobs",
                    }
                ]
            }
        });

        if (!company) {
            throw new NotFoundException("Fail to find this company");
        }
        return company;
    }

    async searchForACompany(query: SearchQueryDto):
        Promise<CompanyDocument | lean<CompanyDocument>> {
        const company = await this.companyRepository.findOne({
            filter: {
                companyName:{ $regex: query.search, $options: "i" } ,
            },
        });

        if (!company) {
            throw new NotFoundException("Fail to find this company");
        }
        return company;
    }

    async softDeleteCompany(user: UserDocument, companyId: Types.ObjectId) {

        const company = await this.companyRepository.findOne({
            filter: {
                _id: companyId,
            }
        });

        if (!company) {
            throw new NotFoundException("This company not exist");
        }

        if (user.role === RoleEnum.User && company.createdBy.toString() !== user._id.toString()) {
            throw new BadRequestException("Not Authorized Account");
        }

        const updatedCompany = await this.companyRepository.updateOne({
            filter: {
                _id: companyId, 
            },
            update: {
                deletedAt: new Date(),
            }
        });
        const jobs = await this.jobRepository.find({
            filter: {
                companyId,
            }
        });
        const jobIds = jobs.map((job) => job._id as Types.ObjectId);
        await Promise.all([
            this.jobRepository.updateMany({
                filter: {
                    companyId: companyId,
                },
                update: {
                    deletedAt: new Date(),
                }
            }),
        
            this.applicationRepository.updateMany({
                filter: {
                    jobId: { $in: jobIds },
                },
                update: {
                    deletedAt: new Date(),
                }
            })
        ]);


        if (!updatedCompany.matchedCount) {
            throw new BadRequestException("Fail to delete this company");
        }


        return "Company deleted successfully";
        
    }

    async uploadLogoPic(user: UserDocument, companyId: Types.ObjectId, file: Express.Multer.File): Promise<CompanyDocument | lean<CompanyDocument>> {
       
        companyId = new Types.ObjectId(companyId);
        
        const logo = await this.cloudinaryService.uploadFile({
            file: file.path,
            path: `company/${companyId.toString()}/logo`,
        })

        const companyWithNewLogo = await this.companyRepository.findOneAndUpdate({
            filter: {
                _id: companyId,
                createdBy: user._id,

            },
            update: {
                logo,
            },
            options: {
                new: false,
            }
        });

        if (companyWithNewLogo?.logo?.public_id) {
            await this.cloudinaryService.destroyFile({
                public_id: companyWithNewLogo.logo.public_id,
            });
        }

        if (!companyWithNewLogo) {
            throw new NotFoundException("This company not exist");
        }
        return companyWithNewLogo;
    }

    async uploadCoverPic(user: UserDocument, companyId: Types.ObjectId, files: Express.Multer.File[]):
        Promise<CompanyDocument | lean<CompanyDocument>> {
      
        const company = await this.companyRepository.findOne({
            filter: {
                _id: companyId,
                createdBy: user._id,
            }
        });

        if (!company) {
            throw new NotFoundException("This company not exist");
        };
        const oldCoverPics = company.coverPic.map(picture => {
            return picture.public_id;
        });

        company.coverPic = await this.cloudinaryService.uploadFiles({
            files: files.map(file => file.path),
            path: `company/${companyId.toString()}/coverPics`,
        });
        await company.save();

        if (oldCoverPics.length) {
            await this.cloudinaryService.deleteResources({
                public_ids: oldCoverPics,
            })
        }
        return company;
    }
    

    async deleteLogoPic(user: UserDocument, companyId: Types.ObjectId):
        Promise<CompanyDocument | lean<CompanyDocument>> {
        const company = await this.companyRepository.findOne({
            filter: {
                _id: companyId,
                createdBy: user._id,
            }
        });

        if (!company) {
            throw new NotFoundException("This company not exist");
        }
        
        await this.cloudinaryService.destroyFile({
            public_id: company.logo.public_id,
        });

        const updateCompany = await this.companyRepository.updateOne({
            filter: {
                _id: companyId,
            },
            update: {
                $set: { logo: null },
            }
        });

        if (!updateCompany.matchedCount) {
            throw new BadRequestException("Fail to delete logo company");
        }
        return company;
    }

    async deleteCoverPic(user: UserDocument, companyId: Types.ObjectId):
        Promise<CompanyDocument | lean<CompanyDocument>> {
        const company = await this.companyRepository.findOne({
            filter: {
                _id: companyId,
                createdBy: user._id,
            }
        });

        if (!company) {
            throw new NotFoundException("This company not exist");
        }
        const oldCoverPics = company.coverPic.map(picture => {
            return picture.public_id;
        });
        

        await this.cloudinaryService.deleteResources({
            public_ids: oldCoverPics,
        });

        const updateCompany = await this.companyRepository.updateOne({
            filter: {
                _id: companyId,
            },
            update: {
                $set: { coverPic: null },
            }
        });

        if (!updateCompany.matchedCount) {
            throw new BadRequestException("Fail to delete cover pictures");
        }

        return company;
    }

   
}