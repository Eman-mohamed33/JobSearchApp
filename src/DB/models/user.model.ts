import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { decryptEncryption, generateEncryption, generateHash, IPicture, IUser } from "src/common";
import { GenderEnum, ProviderEnum, RoleEnum } from "src/common/enums/user.enum";

@Schema({})
export class Picture implements IPicture {
  @Prop({ type: String, required: true })
  secure_url: string;
  @Prop({ type: String, required: true })
  public_id: string;
}

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
export class User implements IUser {
  @Prop({ type: String, required: true, minlength: 2, maxlength: 2000 })
  firstName: string;
  @Prop({ type: String, required: true, minlength: 2, maxlength: 2000 })
  lastName: string;

  @Virtual({
    get: function (this: User) {
      return `${this.firstName} ${this.lastName}`;
    },
  })
  userName: string;
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({
    type: String,
    required: function (this: User) {
      return this.provider === ProviderEnum.Google ? false : true;
    },
  })
  password: string;

  @Prop({
    type: String,
    required: function (this: User) {
      return this.provider === ProviderEnum.Google ? false : true;
    },
  })
  mobileNumber: string;

  @Prop({ type: Picture })
  profilePic: Picture;
  @Prop([{ type: Picture }])
  coverPic: Picture[];

  @Prop({ type: String, enum: ProviderEnum, default: ProviderEnum.System })
  provider: ProviderEnum;
  @Prop({ type: String, enum: GenderEnum, default: GenderEnum.Male })
  gender: GenderEnum;
  @Prop({ type: String, enum: RoleEnum, default: RoleEnum.User })
  role: RoleEnum;

  @Prop({ type: Boolean })
  isConfirmed: boolean;

  @Prop({
    type: Date,
    required: function (this: User) {
      return this.provider === ProviderEnum.Google ? false : true;
    },
  })
  DOB: Date;

  @Prop({ type: Date })
  deletedAt: Date;
  @Prop({ type: Date })
  bannedAt: Date;
  @Prop({ type: Date })
  changeCredentialTime: Date;

  @Prop([{ type: Types.ObjectId, ref: "Otp" }])
  otp: Types.ObjectId[];
  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: Types.ObjectId;
}

const userSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await generateHash(this.password);
  }

  if (this.isModified("mobileNumber")) {
    this.mobileNumber = await generateEncryption({ plainText: this.mobileNumber });
  }
  next();
});

// userSchema.pre("findOne", async function (next) {
//   const query = this.getQuery();
//   if (query.mobileNumber) {
//     //this.mobileNumber = await decryptEncryption({ plainText: this.mobileNumber });
//     this.setQuery({
//       ...query,
//       mobileNumber: await decryptEncryption({ plainText: this.mobileNumber }),
//     });
//   }
//   next();
// });

userSchema.pre(["find", "findOne"], function (next) {
  const query = this.getQuery();
  if (query.paranoid === false) {
    this.setQuery({ ...query });
  } else {
    this.setQuery({ ...query, deletedAt: { $exists: false } });
  }
  next();
});

export const UserModel = MongooseModule.forFeature([
  {
    name: User.name,
    schema: userSchema,
  },
]);
export const connectedSockets = new Map<string, string[]>();
