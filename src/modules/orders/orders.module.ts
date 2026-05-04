import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderRepository } from './repositories/order.repository';
import { Order, OrderSchema } from './schemas/order.schema';
import { DatabaseModule } from '@modules/database/database.module';

@Module({
    imports: [
        DatabaseModule,
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
        ClientsModule.registerAsync([
            {
                name: 'USER_SERVICE',
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'user',
                        protoPath: join(__dirname, '../../proto/user.proto'),
                        url: `localhost:${configService.get('GRPC_PORT') ?? 5000}`,
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [OrdersController],
    providers: [OrdersService, OrderRepository],
})
export class OrdersModule {}
