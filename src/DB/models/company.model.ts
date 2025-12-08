import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { ICompany } from "src/common";
import { Picture } from "./user.model";

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
  strictQuery: true,
})
export class Company implements ICompany {
  @Prop({ type: String, unique: true, minlength: 2, maxlength: 1000, required: true })
  companyName: string;
  @Prop({ type: String, minlength: 10, maxlength: 50000, required: true })
  description: string;
  @Prop({ type: String, required: true })
  industry: string;
  @Prop({ type: String, required: true })
  address: string;
  @Prop({ type: String, unique: true, required: true })
  companyEmail: string;

  @Prop({ type: Number, required: true, min: 11, max: 20 })
  numberOfEmployees: number;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: Types.ObjectId;
  @Prop([{ type: Types.ObjectId, ref: "User" }])
  hRs: Types.ObjectId[];

  @Prop({ type: Date })
  bannedAt: Date;
  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Boolean })
  approvedByAdmin: boolean;

  @Prop({ type: Picture, required: true })
  logo: Picture;
  @Prop([{ type: Picture, required: true }])
  coverPic: Picture[];
  @Prop({ type: Picture, required: true })
  legalAttachment: Picture;
}

export type CompanyDocument = HydratedDocument<Company>;
const companySchema = SchemaFactory.createForClass(Company);
companySchema.virtual("jobs", {
  localField: "_id",
  foreignField: "Company",
  ref: "Job",
});

export const CompanyModel = MongooseModule.forFeature([
  {
    name: Company.name,
    schema: companySchema,
  },
]);
