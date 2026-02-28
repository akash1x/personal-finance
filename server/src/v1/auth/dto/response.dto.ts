import { User } from 'src/entities/user.entity';

export class AuthLoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

export class AuthRegisterResponseDto {
  user: Pick<User, 'firstName' | 'email'>;
}

export class AuthProfileResponseDto {
  user: User;
}
