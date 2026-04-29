import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { BaseRepository } from '@common/repositories/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
    constructor(@InjectModel(User.name) model: Model<UserDocument>) {
        super(model);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.findOne({ email });
    }

    async findByEmailOrId(emailOrId: string): Promise<UserDocument | null> {
        return this.findOne({
            $or: [{ email: emailOrId }, { _id: emailOrId }],
        } as Record<string, any>);
    }

    async findByRole(role: string): Promise<UserDocument[]> {
        return this.findMany({ role });
    }

    async emailExists(email: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        return user !== null;
    }
}
