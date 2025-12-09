import { UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Auth } from "src/common/decorators/auth.decorator";
import { BanEnum, RoleEnum } from "src/common/enums/user.enum";
import { DisplayAllDataResponse, OneUserResponse } from "./entities/user.entity";
import { UserRepository } from "src/DB/repositories/user.repository";
import { CompanyDocument, CompanyRepository } from "src/DB";
import { OneCompanyResponse } from "../company/entities/company.entity";
import { GraphQLError } from "graphql";
import { UpdateQuery } from "mongoose";
import { UserDocument } from "src/DB/models/user.model";

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver()
export class AdminResolver {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly companyRepository: CompanyRepository,
  ) { }
    
    @Query(() => String)
    sayHello(): string {
        return "Hello";
    }

    @Auth([RoleEnum.Admin])
    @Query(() => DisplayAllDataResponse)
    async displayAllData() {
        const users = await this.userRepository.find({
            filter: {},
        });

        const companies = await this.companyRepository.find({
            filter: {},
            options: {
                populate: [
                    {
                        path:"createdBy"
                    },
                    {
                        path:"hRs"
                    }
                ]
            }
        })

        return { users, companies };
    }

     @Auth([RoleEnum.Admin])
    @Mutation(() => OneUserResponse)
    async banOrUnBannedUser(
        @Args("userId") userId: string,
        @Args("action") action: BanEnum,
    ) {
        let update: UpdateQuery<UserDocument> = {
            bannedAt: new Date(),
        };

        if (action === BanEnum.UnBanned) {
            update = {
                $unset: { bannedAt: 1 },
            };
        }

        const user = await this.userRepository.findOneAndUpdate({
            filter: {
                _id: userId,
            },
            update
        });

        if (!user) {
            throw new GraphQLError("Fail to find this account");
        }
        return user;
    }

    @Auth([RoleEnum.Admin])
    @Mutation(() => OneCompanyResponse)
    async banOrUnBannedCompany(
        @Args("companyId") companyId: string,
        @Args("action") action: BanEnum,
    ): Promise<OneCompanyResponse> {

        let update: UpdateQuery<CompanyDocument> = {
            bannedAt: new Date(),
        };

        if (action === BanEnum.UnBanned) {
            update = {
                $unset: { bannedAt: 1 },
            };
        }

        const company = await this.companyRepository.findOneAndUpdate({
            filter: {
                _id: companyId,
            },
            update
        });

        if (!company) {
            throw new GraphQLError("Fail to find this company");
        }
        return company;
    }


    @Auth([RoleEnum.Admin])
    @Mutation(() => OneCompanyResponse)
    async approveCompany(
        @Args("companyId") companyId: string,
    ): Promise<OneCompanyResponse> {
        const company = await this.companyRepository.findOneAndUpdate({
            filter: {
                _id: companyId,
                legalAttachment: { $exists: true },
            },
            update: {
                approvedByAdmin: true,
            }
        });

        if (!company) {
            throw new GraphQLError("Fail to find this company");
        }
        return company;
    }

}