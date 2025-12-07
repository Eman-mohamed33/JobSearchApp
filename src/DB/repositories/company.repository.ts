import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from './db.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument as TDocument } from '../models';
import { Model } from 'mongoose';

@Injectable()
export class CompanyRepository extends DatabaseRepository<Company> {
  constructor(
    @InjectModel(Company.name) protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
