import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
    broker: process.env.KAFKA_BROKER || 'localhost:9092',
    clientId: process.env.KAFKA_CLIENT_ID || 'nestjs-exam',
    groupId: process.env.KAFKA_GROUP_ID || 'nestjs-exam-group',
}));