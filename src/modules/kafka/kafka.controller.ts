import { Controller, Post, Body, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';

@Controller('kafka')
export class KafkaController {
    private readonly logger = new Logger(KafkaController.name);

    constructor(private readonly kafkaService: KafkaService) {}

    @Post('send')
    async sendMessage(@Body() body: { topic: string; message: any }) {
        await this.kafkaService.sendMessage(body.topic, body.message);
        return { success: true, message: 'Message sent to Kafka' };
    }

    @EventPattern('user.created')
    handleUserCreated(@Payload() data: any) {
        this.logger.log(`[user.created] ${JSON.stringify(data?.value ?? data)}`);
    }

    @EventPattern('user.updated')
    handleUserUpdated(@Payload() data: any) {
        this.logger.log(`[user.updated] ${JSON.stringify(data?.value ?? data)}`);
    }

    @EventPattern('user.deleted')
    handleUserDeleted(@Payload() data: any) {
        this.logger.log(`[user.deleted] ${JSON.stringify(data?.value ?? data)}`);
    }
}
