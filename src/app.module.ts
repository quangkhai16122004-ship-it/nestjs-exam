import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { DatabaseModule } from '@modules/database/database.module';
import { CacheModule } from '@modules/cache/cache.module';
import { KafkaModule } from '@modules/kafka/kafka.module';
import { LoggerMiddleware } from '@common/middleware/logger/logger.middleware';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import kafkaConfig from './config/kafka.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, redisConfig, kafkaConfig],
            envFilePath: '.env',
        }),
        DatabaseModule,
        CacheModule,
        KafkaModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
