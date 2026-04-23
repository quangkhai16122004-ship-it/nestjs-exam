import { Controller, Post, Body } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Controller('kafka')
export class KafkaController {
    constructor(private readonly kafkaService: KafkaService) { }

    @Post('send')
    async sendMessage(@Body() body: { topic: string; message: any }) {
        await this.kafkaService.sendMessage(body.topic, body.message);
        return { success: true, message: 'Message sent to Kafka' };
    }

    @Post('send-response')
    async sendMessageWithResponse(@Body() body: { topic: string; message: any }) {
        const response = await this.kafkaService.sendMessageWithResponse(body.topic, body.message);
        return { success: true, response };
    }
}