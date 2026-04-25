import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '@modules/database/database.service';
import { KafkaService } from '@modules/kafka/kafka.service';
import { CacheService } from '@modules/cache/cache.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const CACHE_TTL = 300;

@Injectable()
export class UsersService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly kafkaService: KafkaService,
        private readonly cacheService: CacheService,
    ) {}

    async create(dto: CreateUserDto) {
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.databaseService.createUser({ ...dto, password: hashed });

        await this.cacheService.del('users:all');
        await this.kafkaService.sendMessage('user.created', {
            id: (user as any)._id,
            email: user.email,
            name: user.name,
        });

        return this.sanitize(user);
    }

    async findAll() {
        const cached = await this.cacheService.get<any[]>('users:all');
        if (cached) return cached;

        const users = await this.databaseService.findAllUsers();
        const sanitized = users.map(u => this.sanitize(u));
        await this.cacheService.set('users:all', sanitized, CACHE_TTL);
        return sanitized;
    }

    async findOne(id: string) {
        const cacheKey = `user:${id}`;
        const cached = await this.cacheService.get<any>(cacheKey);
        if (cached) return cached;

        const user = await this.databaseService.findUserById(id);
        if (!user) throw new NotFoundException(`Không tìm thấy user với id ${id}`);

        const sanitized = this.sanitize(user);
        await this.cacheService.set(cacheKey, sanitized, CACHE_TTL);
        return sanitized;
    }

    async findByEmail(email: string) {
        return this.databaseService.findUserByEmail(email);
    }

    async update(id: string, dto: UpdateUserDto) {
        const user = await this.databaseService.updateUser(id, dto);
        if (!user) throw new NotFoundException(`Không tìm thấy user với id ${id}`);

        await Promise.all([
            this.cacheService.del(`user:${id}`),
            this.cacheService.del('users:all'),
        ]);
        await this.kafkaService.sendMessage('user.updated', {
            id: (user as any)._id,
            email: user.email,
            name: user.name,
        });

        return this.sanitize(user);
    }

    async remove(id: string) {
        const user = await this.databaseService.deleteUser(id);
        if (!user) throw new NotFoundException(`Không tìm thấy user với id ${id}`);

        await Promise.all([
            this.cacheService.del(`user:${id}`),
            this.cacheService.del('users:all'),
        ]);
        await this.kafkaService.sendMessage('user.deleted', {
            id: (user as any)._id,
            email: user.email,
        });

        return { message: `Đã xoá user ${id}` };
    }

    sanitize(user: any) {
        const obj = user.toObject ? user.toObject() : { ...user };
        const { password, ...rest } = obj;
        return rest;
    }
}
