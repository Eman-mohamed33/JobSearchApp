import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from './db.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument as TDocument } from '../models';
import { Model } from 'mongoose';

@Injectable()
export class JobRepository extends DatabaseRepository<Job> {
  constructor(
    @InjectModel(Job.name) protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
