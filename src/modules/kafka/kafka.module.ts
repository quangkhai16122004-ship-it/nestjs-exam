import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaController } from './kafka.controller';
import { KafkaService } from './kafka.service';


@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_SERVICE',
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => {
                    const clientId = configService.get<string>('kafka.clientId') ?? 'nestjs-exam';
                    const broker = configService.get<string>('kafka.broker') ?? 'localhost:9092';
                    const groupId = configService.get<string>('kafka.groupId') ?? 'nestjs-exam-group';

                    return {
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                clientId,
                                brokers: [broker],
                            },
                            consumer: {
                                groupId,
                            },
                        },
                    };
                },
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [KafkaController],
    providers: [KafkaService],
    exports: [KafkaService, ClientsModule],
})
export class KafkaModule { }