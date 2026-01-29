import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthLoginDto, AuthRegisterDto } from './dto/request.dto';
import { UsersService } from 'src/users/users.service';
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
    console.log(user);
    if (!bcrypt.compareSync(password, user.password)) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    const payload = {
      sub: user.id,
      username: user.firstName,
    };
    const token = await this.jwtService.signAsync(payload);
    return { token };
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
}
