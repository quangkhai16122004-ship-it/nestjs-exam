import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('Request');

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, ip } = req;
        this.logger.log(`[${ip}] ${method} ${originalUrl}`);
        next();
    }
}
