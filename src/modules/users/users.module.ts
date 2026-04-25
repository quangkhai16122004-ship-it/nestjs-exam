import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@modules/database/database.module';
import { KafkaModule } from '@modules/kafka/kafka.module';

@Module({
    imports: [DatabaseModule, KafkaModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
