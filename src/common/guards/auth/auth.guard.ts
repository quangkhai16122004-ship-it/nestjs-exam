import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { CacheService } from '@modules/cache/cache.service';
import { ROLES_KEY } from '@common/decorators/roles/roles.decorators';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly cacheService: CacheService,
        private readonly reflector: Reflector,
        private readonly configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const authHeader: string = request.headers['authorization'] ?? '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

        if (!token) {
            throw new UnauthorizedException('Không tìm thấy token, vui lòng đăng nhập');
        }

        let payload: any;
        try {
            const secret = this.configService.get<string>('JWT_SECRET');
            payload = this.jwtService.verify(token, { secret });
        } catch (err: any) {
            this.logger.error(`JWT verify thất bại: ${err?.message}`);
            throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
        }

        const sessionUserId = await this.cacheService.get<string>(`session:${token}`);
        if (!sessionUserId) {
            throw new UnauthorizedException('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        }

        request.user = payload;
        request.token = token; 

        const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
        if (requiredRoles && requiredRoles.length > 0) {
            const userRoles: string[] = payload.roles ?? [];
            const hasRole = requiredRoles.some(role => userRoles.includes(role));
            if (!hasRole) {
                throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này');
            }
        }

        return true;
    }
}
