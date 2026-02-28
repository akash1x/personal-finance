import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthLoginDto, AuthRegisterDto } from './dto/request.dto';
import { UsersService } from 'src/v1/users/users.service';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  AuthLoginResponseDto,
  AuthProfileResponseDto,
  AuthRegisterResponseDto,
} from './dto/response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: AuthLoginDto): Promise<AuthLoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.usersService.findUserByEmailWithPassword(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.firstName,
    );
    return { accessToken, refreshToken };
  }

  async register(
    registerDto: AuthRegisterDto,
  ): Promise<AuthRegisterResponseDto> {
    const { email } = registerDto;
    const user = await this.usersService.findUserByEmail(email);
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUser = await this.usersService.create(registerDto as User);
    return {
      user: {
        firstName: createdUser.firstName,
        email: createdUser.email,
      },
    };
  }

  async getProfile(id: string): Promise<AuthProfileResponseDto> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { user };
  }

  async refreshTokens(
    currentRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(currentRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const { accessToken, refreshToken } = await this.generateTokens(
        payload.sub,
        payload.username,
      );
      return { accessToken, refreshToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(
    userId: string,
    username: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, username };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
