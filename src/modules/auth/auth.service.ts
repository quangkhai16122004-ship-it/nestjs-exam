import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '@modules/users/users.service';
import { CacheService } from '@modules/cache/cache.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly cacheService: CacheService,
    ) {}

    async register(dto: RegisterDto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('Email này đã được đăng ký');
        }

        return this.usersService.create(dto);
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }

        const payload = {
            sub: (user as any)._id.toString(),
            email: user.email,
            roles: user.roles,
        };
        const token = this.jwtService.sign(payload);

        await this.cacheService.set(`session:${token}`, payload.sub, SESSION_TTL_SECONDS);

        return {
            access_token: token,
            user: this.usersService.sanitize(user),
        };
    }

    async logout(token: string) {
        await this.cacheService.del(`session:${token}`);
        return { message: 'Đăng xuất thành công' };
    }

    async getProfile(userId: string) {
        return this.usersService.findOne(userId);
    }
}
