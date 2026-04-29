import { Document, Model } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
    constructor(protected model: Model<T>) { }

    async create(data: Partial<T>): Promise<T> {
        const createdDocument = new this.model(data);
        return createdDocument.save();
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async findAll(): Promise<T[]> {
        return this.model.find().exec();
    }

    async findOne(filter: Record<string, any>): Promise<T | null> {
        return this.model.findOne(filter).exec();
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return this.model
            .findByIdAndUpdate(id, data, { new: true })
            .exec();
    }

    async delete(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }

    async findMany(filter: Record<string, any>): Promise<T[]> {
        return this.model.find(filter).exec();
    }
}
