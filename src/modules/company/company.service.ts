import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CompanyDocument, CompanyRepository, lean } from "src/DB";
import { UserDocument } from "src/DB/models/user.model";
import { AddCompanyBodyDto, SearchQueryDto, UpdateCompanyBodyDto } from "./dto/company.dto";
import { S3Service, StorageEnum } from "src/common";
import { Types } from "mongoose";
import { RoleEnum } from "src/common/enums/user.enum";
import { url } from "inspector";

@Injectable()
export class CompanyService {
    constructor(
        private readonly companyRepository: CompanyRepository,
        private readonly s3Service: S3Service,
    ) { }
    
    async addCompany(body: AddCompanyBodyDto, user: UserDocument, file: Express.Multer.File) :Promise<CompanyDocument>{
        
        const checkCompanyExist = await this.companyRepository.findOne({
            filter: {
                companyEmail: body.companyEmail,
                companyName: body.companyName,
            }
        });

        if (checkCompanyExist) {
            throw new ConflictException("This company is already exist");
        }

        const legalAttachment = await this.s3Service.uploadFile({
            storageApproach: StorageEnum.Disk,
            file,
            path: `company/${user._id.toString()}/documents`,
        });

        const [company] = await this.companyRepository.create({
            data: [{
                ...body,
                createdBy: user._id,
                legalAttachment: {
                    secure_url: legalAttachment,
                    public_id: legalAttachment,
                },
                approvedByAdmin: user.role === RoleEnum.Admin ? true : false,
            }]
        })

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
                ...body
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
                        path: "jobs"
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
                companyName: { $regex: query.search, options: "i" },
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

        if (user.role !== RoleEnum.Admin && company.createdBy !== user._id) {
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

        if (!updatedCompany.matchedCount) {
            throw new BadRequestException("Fail to delete this company");
        }

        return "Company deleted successfully";
        
    }

    async uploadLogoPic(user: UserDocument, companyId: Types.ObjectId, file: Express.Multer.File): Promise<CompanyDocument | lean<CompanyDocument>> {
        const company = await this.companyRepository.findOne({
            filter: {
                _id: companyId,
                createdBy: user._id,
            }
        });

        if (!company) {
            throw new NotFoundException("This company not exist");
        }
        
        company.logo.secure_url = await this.s3Service.uploadFile({
            storageApproach: StorageEnum.Disk,
            path: `company/${company._id.toString()}/logo`,
            file
        });

        await company.save();
        return company;
    }


    async uploadCoverPic(user: UserDocument, companyId: Types.ObjectId, files: Express.Multer.File[]) {
      
        const company = await this.companyRepository.findOne({
            filter: {
                _id: companyId,
                createdBy: user._id,
            }
        });

        if (!company) {
            throw new NotFoundException("This company not exist");
        };
        const coverPictures = await this.s3Service.uploadFilesOrLargeFiles({
            storageApproach: StorageEnum.Disk,
            path: `company/${companyId.toString()}/cover`,
            files,
        });

        coverPictures.map(url => {
            company.coverPic[0].secure_url = url;
        })

        await company.save();
        return company;
    }
    

    async deleteLogoPic(user: UserDocument, companyId: Types.ObjectId) {
        const company = await this.companyRepository.findOne({
            filter: {
                _id: companyId,
                createdBy: user._id,
            }
        });

        if (!company) {
            throw new NotFoundException("This company not exist");
        }
        
        await this.s3Service.deleteFile({
            Key: company.logo.secure_url
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

    // async deleteCoverPic(user: UserDocument, companyId: Types.ObjectId) {
    //     //   await this.s3Service.deleteFiles({
    //     //       urls: company.coverPic.map(url => {
              
    //     //       })
    //     //   });

    //     return company;
    // }
}