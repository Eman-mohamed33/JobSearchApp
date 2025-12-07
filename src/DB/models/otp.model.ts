import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TypeEnum } from 'src/common';
import { IOtp } from 'src/common/interfaces/otp.interface';

@Schema({
  timestamps: true,
  strictQuery: true,
})
export class Otp implements IOtp {
  @Prop({ type: String, enum: TypeEnum, required: true })
  type: TypeEnum;
  @Prop({ type: String, required: true })
  code: string;
  @Prop({ type: Date, required: true })
  expiresIn: Date;
  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  createdBy: Types.ObjectId;
}

export type OtpDocument = HydratedDocument<Otp>;
const otpSchema = SchemaFactory.createForClass(Otp);
otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 21600 });
export const OtpModel = MongooseModule.forFeature([
  {
    name: Otp.name,
    schema: otpSchema,
  },
]);
