import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('cache')
export class CacheController {
    constructor(private readonly cacheService: CacheService) { }

    @Post('set')
    async setCache(@Body() body: { key: string; value: any; ttl?: number }) {
        await this.cacheService.set(body.key, body.value, body.ttl);
        return { success: true, message: `Set cache key: ${body.key}` };
    }

    @Get('get/:key')
    async getCache(@Param('key') key: string) {
        const value = await this.cacheService.get(key);
        return {
            key,
            value,
            found: value !== undefined
        };
    }

    @Post('delete/:key')
    async deleteCache(@Param('key') key: string) {
        await this.cacheService.del(key);
        return { success: true, message: `Deleted cache key: ${key}` };
    }
}