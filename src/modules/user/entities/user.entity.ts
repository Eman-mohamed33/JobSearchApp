import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Types } from "mongoose";
import { type IPicture, IUser } from "src/common";
import { GenderEnum, ProviderEnum, RoleEnum } from "src/common/enums/user.enum";
import { OneCompanyResponse } from "src/modules/company/entities/company.entity";

@ObjectType()
export class PictureGraphQl implements IPicture {
  @Field(() => String)
  secure_url: string;
  @Field(() => String)
  public_id: string;
}
registerEnumType(RoleEnum, {
  name: "RoleEnum",
});

registerEnumType(ProviderEnum, {
  name: "ProviderEnum",
});

registerEnumType(GenderEnum, {
  name: "GenderEnum",
});
export class UserResponse {
  User: IUser;
}

@ObjectType()
export class OneUserResponse implements IUser {
  @Field(() => ID, { nullable: true })
  _id?: Types.ObjectId;
  @Field(() => ID,{ nullable: true })
  updatedBy?: Types.ObjectId;
  @Field(() => String)
  firstName: string;
  @Field(() => String)
  lastName: string;
  @Field(() => String, { nullable: true })
  userName?: string;
  @Field(() => String)
  email: string;
  @Field(() => String, { nullable: true })
  password?: string;
  @Field(() => String,{ nullable: true })
  mobileNumber: string;
  @Field(() => Boolean, { nullable: true })
  isConfirmed?: boolean;

  @Field(() => Date,{ nullable: true })
  DOB: Date;
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
  @Field(() => Date, { nullable: true })
  bannedAt?: Date;
  @Field(() => Date, { nullable: true })
  createdAt?: Date;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
  @Field(() => Date, { nullable: true })
  changeCredentialTime?: Date;

  @Field(() => PictureGraphQl)
  profilePic: PictureGraphQl;
  @Field(() => [PictureGraphQl])
  coverPic: PictureGraphQl[];

  @Field(() => RoleEnum)
  role: RoleEnum;
  @Field(() => ProviderEnum)
  provider: ProviderEnum;
  @Field(() => GenderEnum)
  gender: GenderEnum;
  @Field(() => [ID])
  otp: Types.ObjectId[];
}
@ObjectType()
export class DisplayAllDataResponse {
  @Field(() => [OneUserResponse])
  users: IUser[];
  @Field(() => [OneCompanyResponse])
  companies: [OneCompanyResponse];
}
