import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { IJob, JobLocationEnum, SeniorityLevelEnum, WorkingTimeEnum } from "src/common";

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
export class Job implements IJob {
  @Prop({ type: Types.ObjectId, ref: "Company", required: true })
  companyId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  addedBy: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  updatedBy: Types.ObjectId;

  @Prop({ type: String, required: true })
  jobTitle: string;
  @Prop({ type: String, required: true, minlength: 10, maxlength: 50000 })
  jobDescription: string;
  @Prop([{ type: String, required: true }])
  technicalSkills: string[];
  @Prop([{ type: String, required: true }])
  softSkills: string[];

  @Prop({ type: Boolean, required: true })
  closed: boolean;

  @Prop({ type: String, enum: JobLocationEnum, required: true })
  jobLocation: JobLocationEnum;
  @Prop({ type: String, enum: WorkingTimeEnum, required: true })
  workingTime: WorkingTimeEnum;
  @Prop({ type: String, enum: SeniorityLevelEnum, required: true })
  seniorityLevel: SeniorityLevelEnum;
}

export type JobDocument = HydratedDocument<Job>;
const jobSchema = SchemaFactory.createForClass(Job);

jobSchema.virtual("applications", {
  localField: "_id",
  foreignField: "Job",
  ref: "Application",
});

export const JobModel = MongooseModule.forFeature([
  {
    name: Job.name,
    schema: jobSchema,
  },
]);
