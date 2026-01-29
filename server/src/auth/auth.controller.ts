import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto, AuthLoginDto } from './dto/request.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: AuthRegisterDto) {
    return this.authService.register(registerDto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: AuthLoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }
}
