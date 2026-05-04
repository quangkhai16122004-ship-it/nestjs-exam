import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersGrpcController {
    constructor(private readonly usersService: UsersService) {}

    @GrpcMethod('UserService', 'FindOne')
    async findOne(data: { id: string }) {
        try {
            const user = await this.usersService.findOne(data.id);
            return this.toGrpcUser(user);
        } catch {
            throw new RpcException(`Không tìm thấy user với id ${data.id}`);
        }
    }

    @GrpcMethod('UserService', 'FindAll')
    async findAll() {
        const users = await this.usersService.findAll();
        return { users: users.map(u => this.toGrpcUser(u)) };
    }

    @GrpcMethod('UserService', 'CreateUser')
    async createUser(data: { name: string; email: string; password: string }) {
        try {
            const user = await this.usersService.create(data);
            return this.toGrpcUser(user);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Lỗi tạo user';
            throw new RpcException(message);
        }
    }

    private toGrpcUser(user: any) {
        return {
            id: (user._id ?? user.id).toString(),
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            roles: user.roles ?? [],
        };
    }
}
