import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '@common/repositories/base.repository';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class OrderRepository extends BaseRepository<OrderDocument> {
    constructor(@InjectModel(Order.name) model: Model<OrderDocument>) {
        super(model);
    }

    findByUserId(userId: string) {
        return this.findMany({ userId });
    }
}
