import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { CompanyDocument, CompanyRepository } from "src/DB";
import { UserDocument } from "src/DB/models/user.model";
import { AddCompanyBodyDto } from "./dto/company.dto";

@Injectable()
export class CompanyService {
    constructor(private readonly companyRepository: CompanyRepository) { }
    
    async addCompany(body: AddCompanyBodyDto, user: UserDocument, file: Express.Multer.File) :Promise<CompanyDocument>{
        
        const checkCompanyExist = await this.companyRepository.findOne({
            filter: {
                companyEmail: body.companyEmail,
                companyName: body.companyName,
            }
        });

        if (checkCompanyExist) {
            throw new ConflictException("")
        }
        const [company] = await this.companyRepository.create({
            data: [{
                ...body,
                createdBy: user._id
            }]
        })

        if (!company) {
            throw new BadRequestException("Fail to add new company");
        }

        return company;
    }

    async updateCompanyData() {
        
    }

    async GetSpecificCompanyWithRelatedJobs() {

    }

    async searchForACompany() {

    }

    async softDeleteCompany(user:UserDocument) {
        const company = await this.companyRepository.findOneAndUpdate({
            filter: {
                createdBy: user._id
            },
            update: {
                deletedAt: new Date(),
            }
        });
    }

    async uploadLogoPic() {

  }

  async uploadCoverPic() {

  }

  async deleteLogoPic() {

  }

  async deleteCoverPic() {

  }
}