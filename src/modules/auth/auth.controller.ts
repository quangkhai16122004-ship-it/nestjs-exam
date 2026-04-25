import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@common/guards/auth/auth.guard';
import { CurrentUser } from '@common/decorators/user/current-user.decorator';
import { CurrentToken } from '@common/decorators/token/current-token.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    logout(@CurrentToken() token: string) {
        return this.authService.logout(token);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@CurrentUser() user: any) {
        return this.authService.getProfile(user.sub);
    }
}
