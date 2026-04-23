import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
@Injectable()
export class DatabaseService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    async createUser(userData: Partial<User>): Promise<User> {
        const createdUser = new this.userModel(userData);
        return createdUser.save();
    }

    async findUserById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async findAllUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
    }

    async deleteUser(id: string): Promise<User | null> {
        return this.userModel.findByIdAndDelete(id).exec();
    }
}