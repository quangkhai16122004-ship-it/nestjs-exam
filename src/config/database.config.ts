import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nestjs-exam',
    dbName: process.env.MONGODB_DB_NAME || 'nestjs-exam',
}));