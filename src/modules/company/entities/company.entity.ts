import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Types } from "mongoose";
import { ICompany } from "src/common";
import { PictureGraphQl } from "src/modules/user/entities/user.entity";

export class CompanyResponse {
  company: ICompany;
}
@ObjectType()
export class OneCompanyResponse implements ICompany {
  @Field(() => ID, { nullable: true })
  _id?: Types.ObjectId;
  @Field(() => ID)
  createdBy: Types.ObjectId;
  @Field(() => [ID])
  hRs: Types.ObjectId[];

  @Field(() => String)
  companyName: string;
  @Field(() => String)
  description: string;
  @Field(() => String)
  industry: string;
  @Field(() => String)
  address: string;
  @Field(() => Number)
  numberOfEmployees: number;
  @Field(() => String)
  companyEmail: string;

  @Field(() => PictureGraphQl, { nullable: true })
  logo: PictureGraphQl;
  @Field(() => [PictureGraphQl], { nullable: true })
  coverPic: PictureGraphQl[];
  @Field(() => PictureGraphQl)
  legalAttachment: PictureGraphQl;

  @Field(() => Boolean)
  approvedByAdmin: boolean;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
  @Field(() => Date, { nullable: true })
  bannedAt?: Date;
  @Field(() => Date, { nullable: true })
  createdAt?: Date;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}