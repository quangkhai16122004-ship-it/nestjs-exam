import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@common/guards/auth/auth.guard';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    create(@Body() dto: CreateOrderDto) {
        return this.ordersService.create(dto);
    }

    @Get()
    findAll() {
        return this.ordersService.findAll();
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
        return this.ordersService.findByUser(userId);
    }
}
