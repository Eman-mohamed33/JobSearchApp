import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from './db.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument as TDocument } from '../models';
import { Model } from 'mongoose';

@Injectable()
export class ChatRepository extends DatabaseRepository<Chat> {
  constructor(
    @InjectModel(Chat.name) protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
