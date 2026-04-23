import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService implements OnModuleInit {
    constructor(
        @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
        private readonly configService: ConfigService,
    ) { }

    async onModuleInit() {
        const topics = ['user.created', 'user.updated', 'user.deleted'];
        topics.forEach(topic => {
            this.client.subscribeToResponseOf(topic);
        });
        await this.client.connect();
    }

    async sendMessage(topic: string, message: any): Promise<void> {
        this.client.emit(topic, message);
    }

    async sendMessageWithResponse(topic: string, message: any): Promise<any> {
        return this.client.send(topic, message).toPromise();
    }

    async handleUserCreated(data: any) {
        console.log('User created event received:', data);
    }

    async handleUserUpdated(data: any) {
        console.log('User updated event received:', data);
    }

    async handleUserDeleted(data: any) {
        console.log('User deleted event received:', data);
    }
}