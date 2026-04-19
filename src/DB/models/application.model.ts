import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { IApplication, StatusEnum } from "src/common";
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
export class Application implements IApplication {
  @Prop({ type: Types.ObjectId, ref: "Job", required: true })
  jobId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;
  @Prop({ type: Picture, required: false })
  userCv: Picture;
  @Prop({ type: String, enum: StatusEnum, default: StatusEnum.Pending })
  status: StatusEnum;
  @Prop({ type: Date })
    deletedAt: Date;
}

export type ApplicationDocument = HydratedDocument<Application>;
const applicationSchema = SchemaFactory.createForClass(Application);
applicationSchema.pre(["find", "findOne", "findOneAndUpdate"], function (next) {
  const query = this.getQuery();
  if (query.paranoid === false) {
    this.setQuery({ ...query });
  } else {
    this.setQuery({ ...query, deletedAt: { $exists: false } });
  }
  next();
});
export const ApplicationModel = MongooseModule.forFeature([
  {
    name: Application.name,
    schema: applicationSchema,
  },
]);
