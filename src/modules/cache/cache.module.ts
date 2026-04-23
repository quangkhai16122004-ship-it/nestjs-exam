import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-yet';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';

@Global()
@Module({
    imports: [
        NestCacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get<string>('redis.host'),
                port: configService.get<number>('redis.port'),
                password: configService.get<string>('redis.password'),
                db: configService.get<number>('redis.db'),
                ttl: 300,
            }),
            inject: [ConfigService],
            isGlobal: true,
        }),
    ],
    controllers: [CacheController],
    providers: [CacheService],
    exports: [CacheService, NestCacheModule],
})
export class CacheModule { }