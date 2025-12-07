import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from './db.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Application, ApplicationDocument as TDocument } from '../models';
import { Model } from 'mongoose';

@Injectable()
export class ApplicationRepository extends DatabaseRepository<Application> {
  constructor(
    @InjectModel(Application.name) protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
