import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IApplication, StatusEnum } from 'src/common';
import { Picture } from './user.model';

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
  jobId: Types.ObjectId
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId
  @Prop({ type: Picture, required: true })
  userCv: Picture
  @Prop({ type: String, enum: StatusEnum, default: StatusEnum.Pending })
  status: StatusEnum
}

export type ApplicationDocument = HydratedDocument<Application>;
const applicationSchema = SchemaFactory.createForClass(Application);
export const ApplicationModel = MongooseModule.forFeature([
  {
    name: Application.name,
    schema: applicationSchema,
  },
]);
