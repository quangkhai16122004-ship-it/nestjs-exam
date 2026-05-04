import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggingInterceptor } from '@common/interceptors/logging/logging.interceptor';
import { join } from 'path';

const logger = new Logger('Bootstrap');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: 'user',
            protoPath: join(__dirname, 'proto/user.proto'),
            url: `0.0.0.0:${configService.get<number>('GRPC_PORT') ?? 5000}`,
        },
    });

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: configService.get<string>('kafka.clientId') ?? 'nestjs-exam',
                brokers: [configService.get<string>('kafka.broker') ?? 'localhost:9092'],
            },
            consumer: {
                groupId: (configService.get<string>('kafka.groupId') ?? 'nestjs-exam-group') + '-consumer',
            },
        },
    });

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));

    app.useGlobalInterceptors(new LoggingInterceptor());

    await app.listen(process.env.PORT ?? 3000);
    logger.log(`HTTP server đang chạy tại port ${process.env.PORT ?? 3000}`);

    app.startAllMicroservices()
        .then(() => {
            logger.log(`gRPC server đang chạy tại port ${configService.get('GRPC_PORT') ?? 5000}`);
            logger.log('Kafka consumer đã kết nối');
        })
        .catch(err => logger.warn(`Microservice không khởi động được: ${err.message}`));
}
bootstrap();
