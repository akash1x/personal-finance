import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/respositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async findUserByEmailWithPassword(email: string) {
    return this.userRepository.findUserByEmailWithPassword(email);
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findUserByEmail({ email });
  }

  async create(user: User) {
    const { password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    return this.userRepository.save(user);
  }

  async findUserById(id: string) {
    return this.userRepository.findUserWithStats(id);
  }

  async userExists(userId: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
