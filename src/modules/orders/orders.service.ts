import { Inject, Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';
import { OrderRepository } from './repositories/order.repository';
import { CreateOrderDto } from './dto/create-order.dto';

interface UserServiceGrpcClient {
    findOne(data: { id: string }): Observable<UserGrpcResponse>;
}

interface UserGrpcResponse {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    roles: string[];
}

@Injectable()
export class OrdersService implements OnModuleInit {
    private userService!: UserServiceGrpcClient;

    constructor(
        @Inject('USER_SERVICE') private readonly client: any,
        private readonly orderRepository: OrderRepository,
    ) {}

    onModuleInit() {
        this.userService = (this.client as ClientGrpc).getService<UserServiceGrpcClient>('UserService');
    }

    async create(dto: CreateOrderDto) {
        let user: UserGrpcResponse;
        try {
            user = await firstValueFrom(this.userService.findOne({ id: dto.userId }));
        } catch {
            throw new BadRequestException(`Không tìm thấy user với id ${dto.userId}`);
        }

        if (!user.isActive) {
            throw new BadRequestException(`User ${user.email} đã bị vô hiệu hoá`);
        }

        const totalPrice = dto.items.reduce(
            (sum, item) => sum + item.quantity * item.unitPrice,
            0,
        );

        const order = await this.orderRepository.create({
            userId: dto.userId,
            items: dto.items,
            totalPrice,
        });

        return order;
    }

    async findAll() {
        return this.orderRepository.findAll();
    }

    async findByUser(userId: string) {
        return this.orderRepository.findByUserId(userId);
    }
}
