import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from './db.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Otp, OtpDocument as TDocument } from '../models';
import { Model } from 'mongoose';

@Injectable()
export class OtpRepository extends DatabaseRepository<Otp> {
  constructor(
    @InjectModel(Otp.name) protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
